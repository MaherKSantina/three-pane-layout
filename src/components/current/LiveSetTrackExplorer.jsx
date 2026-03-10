import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import Stack from "@mui/system/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function countDeepDevices(track) {
  let total = track?.devices?.length || 0;
  for (const d of track?.devices || []) total += countDeviceDeep(d);
  return total;
}

function countDeviceDeep(device) {
  let total = 0;
  for (const c of device?.chains || []) {
    total += c?.devices?.length || 0;
    for (const cd of c?.devices || []) total += countDeviceDeep(cd);
  }
  return total;
}

function getDeviceType(device) {
  // Lightly normalize common types from class_name
  const c = device?.class_name || "";
  if (c.includes("PluginDevice")) return "Plugin";
  if (c.includes("DrumGroupDevice")) return "Drum Rack";
  if (c.includes("InstrumentGroupDevice")) return "Instrument Rack";
  if (c.includes("Compressor")) return "Compressor";
  if (c.includes("Gate")) return "Gate";
  if (c.includes("OriginalSimpler")) return "Simpler";
  if (c.includes("Midi")) return "MIDI";
  return c || "Device";
}

function badgeForDevice(device) {
  const type = getDeviceType(device);
  return type;
}

function useClipboard() {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  }, []);

  return { copied, copy };
}

function DeviceRow({ device, depth = 0, filter }) {
  const { copied, copy } = useClipboard();

  const chains = device?.chains || [];
  const hasChains = !!device?.can_have_chains && chains.length > 0;

  // filtering: show device if it or any descendant matches
  const query = (filter?.query || "").trim().toLowerCase();
  const typeFilter = filter?.type || "All";

  const selfText = `${device?.name || ""} ${device?.class_name || ""} ${device?.path || ""}`.toLowerCase();
  const selfMatchesQuery = !query || selfText.includes(query);
  const selfMatchesType = typeFilter === "All" ? true : badgeForDevice(device) === typeFilter;

  const descendantMatches = React.useMemo(() => {
    if (!hasChains) return false;
    const walk = (d) => {
      for (const c of d?.chains || []) {
        for (const cd of c?.devices || []) {
          const t = `${cd?.name || ""} ${cd?.class_name || ""} ${cd?.path || ""}`.toLowerCase();
          const qOk = !query || t.includes(query);
          const tyOk = typeFilter === "All" ? true : badgeForDevice(cd) === typeFilter;
          if (qOk && tyOk) return true;
          if (walk(cd)) return true;
        }
      }
      return false;
    };
    return walk(device);
  }, [device, hasChains, query, typeFilter]);

  const shouldRender = (selfMatchesQuery && selfMatchesType) || descendantMatches;
  if (!shouldRender) return null;

  return (
    <Box sx={{ pl: depth ? 2 : 0 }}>
      <Grid
        container
        alignItems="center"
        columnSpacing={1.25}
        rowSpacing={0.5}
        sx={{
          py: 0.75,
          px: 1,
          borderRadius: 1,
          "&:hover": { backgroundColor: "action.hover" },
        }}
      >
        <Grid size="grow">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 0 }} noWrap>
              {device?.name || "(unnamed device)"}
            </Typography>
            <Chip size="small" label={badgeForDevice(device)} />
            {hasChains ? (
              <Chip size="small" variant="outlined" label={`${chains.length} chain${chains.length === 1 ? "" : "s"}`} />
            ) : null}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {device?.class_name || ""}
          </Typography>
        </Grid>

        <Grid size="auto">
          {device?.path ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 260 }} noWrap>
                {device.path}
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy path"}>
                <IconButton size="small" onClick={() => copy(device.path)} aria-label="Copy device path">
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}
        </Grid>
      </Grid>

      {hasChains ? (
        <Box sx={{ mt: 0.5, mb: 0.5 }}>
          {chains.map((chain) => (
            <ChainAccordion key={`${device.path || device.name}-chain-${chain.index}`} chain={chain} depth={depth + 1} filter={filter} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function ChainAccordion({ chain, depth, filter }) {
  const devices = chain?.devices || [];
  const query = (filter?.query || "").trim().toLowerCase();
  const typeFilter = filter?.type || "All";

  // if filtering, only show chain if any device matches down the tree
  const chainMatches = React.useMemo(() => {
    if (!query && typeFilter === "All") return true;

    const walkDevices = (devs) => {
      for (const d of devs) {
        const t = `${d?.name || ""} ${d?.class_name || ""} ${d?.path || ""}`.toLowerCase();
        const qOk = !query || t.includes(query);
        const tyOk = typeFilter === "All" ? true : badgeForDevice(d) === typeFilter;
        if (qOk && tyOk) return true;

        // drill into nested chains if present
        for (const c of d?.chains || []) {
          if (walkDevices(c?.devices || [])) return true;
        }
      }
      return false;
    };

    return walkDevices(devices);
  }, [devices, query, typeFilter]);

  if (!chainMatches) return null;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        ml: depth ? 1 : 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        "&:before": { display: "none" },
        mb: 1,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }} noWrap>
            {chain?.name || `Chain ${chain?.index ?? ""}`}
          </Typography>
          <Chip size="small" variant="outlined" label={`${devices.length} device${devices.length === 1 ? "" : "s"}`} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        {devices.map((d, i) => (
          <DeviceRow key={`${d.path || d.name}-${i}`} device={d} depth={depth} filter={filter} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default function LiveSetTrackExplorer({ data }) {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("All");

  const tracks = data?.tracks || [];
  const trackCount = data?.trackCount ?? tracks.length;

  const allDeviceTypes = React.useMemo(() => {
    const set = new Set();
    const walkDevice = (d) => {
      set.add(badgeForDevice(d));
      for (const c of d?.chains || []) for (const cd of c?.devices || []) walkDevice(cd);
    };
    for (const t of tracks) for (const d of t?.devices || []) walkDevice(d);
    return ["All", ...Array.from(set).sort()];
  }, [tracks]);

  const filter = React.useMemo(() => ({ query, type }), [query, type]);

  const filteredTracks = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && type === "All") return tracks;

    const trackMatches = (t) => {
      const tText = `${t?.name || ""} track ${t?.index ?? ""}`.toLowerCase();
      if (q && tText.includes(q) && type === "All") return true;

      const walkDevice = (d) => {
        const text = `${d?.name || ""} ${d?.class_name || ""} ${d?.path || ""}`.toLowerCase();
        const qOk = !q || text.includes(q);
        const tyOk = type === "All" ? true : badgeForDevice(d) === type;
        if (qOk && tyOk) return true;

        for (const c of d?.chains || []) for (const cd of c?.devices || []) if (walkDevice(cd)) return true;
        return false;
      };

      for (const d of t?.devices || []) if (walkDevice(d)) return true;
      return false;
    };

    return tracks.filter(trackMatches);
  }, [tracks, query, type]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderRadius: 3,
        }}
      >
        <Grid container spacing={1.5} alignItems="center">
          <Grid size="grow">
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Track List Explorer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data?.type ? `${data.type} • ` : ""}
                {trackCount} track{trackCount === 1 ? "" : "s"} • {tracks.reduce((acc, t) => acc + (t?.deviceCount || 0), 0)} top-level device
                {tracks.reduce((acc, t) => acc + (t?.deviceCount || 0), 0) === 1 ? "" : "s"} •{" "}
                {tracks.reduce((acc, t) => acc + countDeepDevices(t), 0)} total device
                {tracks.reduce((acc, t) => acc + countDeepDevices(t), 0) === 1 ? "" : "s"} (incl. racks)
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: "auto" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: 520 } }}>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                label="Search"
                placeholder="Track, device, class, or path…"
                size="small"
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                {allDeviceTypes.slice(0, 6).map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    clickable
                    onClick={() => setType(t)}
                    color={type === t ? "primary" : "default"}
                    variant={type === t ? "filled" : "outlined"}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
                {allDeviceTypes.length > 6 ? (
                  <Chip
                    label={type === "All" ? `+${allDeviceTypes.length - 6} more` : "More"}
                    variant="outlined"
                    clickable
                    onClick={() => {
                      // quick cycle as a lightweight "more" without adding a select
                      const idx = allDeviceTypes.indexOf(type);
                      const next = allDeviceTypes[(idx + 1) % allDeviceTypes.length];
                      setType(next);
                    }}
                    sx={{ fontWeight: 600 }}
                  />
                ) : null}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        <List disablePadding>
          {filteredTracks.map((track, i) => {
            const topDevices = track?.devices || [];
            const deepTotal = countDeepDevices(track);

            return (
              <React.Fragment key={`track-${track.index}-${track.name}-${i}`}>
                <ListItem sx={{ px: 1.5, py: 1.25, alignItems: "flex-start" }}>
                  <Box sx={{ width: "100%" }}>
                    <Accordion
                      disableGutters
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        "&:before": { display: "none" },
                      }}
                      defaultExpanded={track?.deviceCount > 0 && track?.deviceCount <= 1}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
                          <Grid size="grow">
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                              <Typography variant="body1" sx={{ fontWeight: 800 }} noWrap>
                                {String(track.index).padStart(2, "0")} — {track.name}
                              </Typography>
                              <Chip size="small" variant="outlined" label={`${track.deviceCount || 0} top`} />
                              <Chip size="small" variant="outlined" label={`${deepTotal} total`} />
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                              {track.deviceCount ? "Has devices / racks" : "No devices"}
                            </Typography>
                          </Grid>

                          <Grid size="auto">
                            <Typography variant="caption" color="text.secondary">
                              Track {track.index}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails sx={{ pt: 0 }}>
                        {topDevices.length === 0 ? (
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">No devices</Typography>}
                          />
                        ) : (
                          <Box sx={{ pb: 0.5 }}>
                            {topDevices.map((d, di) => (
                              <DeviceRow key={`${d.path || d.name}-${di}`} device={d} depth={0} filter={filter} />
                            ))}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </ListItem>
                {i < filteredTracks.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            );
          })}
        </List>

        {filteredTracks.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              No matches
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term (e.g. “Serum”, “Gate”, “Instrument Rack”, “tracks 2”).
            </Typography>
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}

/**
 * Usage:
 *
 * <LiveSetTrackExplorer data={yourJsonObject} />
 */
