import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import styled from "@mui/system/styled";
import { alpha, useTheme } from "@mui/material/styles";
import { Chip, Divider, Paper, Stack, Typography } from "@mui/material";

/**
 * ScheduleList props:
 * - items: Item[] (can be undefined)
 * - groupRules: Array<{
 *     title: string,
 *     include: (item, ancestors) => boolean,
 *     sort?: (a, b) => number   // receives { item, ancestors }
 *   }>
 * - renderItem: (item, ancestors) => ReactNode
 */
const Section = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${alpha(
    theme?.palette?.text?.primary ?? "#111",
    theme?.palette?.mode === "dark" ? 0.16 : 0.12
  )}`,
  overflow: "hidden",
}));

function safeAlpha(color, value) {
  try {
    return alpha(color, value);
  } catch {
    return alpha("#111", value);
  }
}

function flattenWithAncestors(items) {
  const out = [];
  const safeItems = Array.isArray(items) ? items : [];

  function walk(arr, ancestors) {
    (Array.isArray(arr) ? arr : []).forEach((it) => {
      const item = it || {};
      const a = Array.isArray(ancestors) ? ancestors : [];
      out.push({ item, ancestors: a });

      if (Array.isArray(item.children) && item.children.length) {
        walk(item.children, [...a, item]);
      }
    });
  }

  walk(safeItems, []);
  return out;
}

export function ScheduleList({ items, groupRules, renderItem }) {
  const themeMaybe = useTheme();
  const theme = themeMaybe || {};

  const all = React.useMemo(() => flattenWithAncestors(items), [items]);

  const groups = React.useMemo(() => {
    const rules = Array.isArray(groupRules) ? groupRules : [];

    return rules
      .map((r, idx) => {
        const title = (r && r.title) || `Group ${idx + 1}`;
        const include =
          r && typeof r.include === "function" ? r.include : () => false;
        const sortFn =
          r && typeof r.sort === "function" ? r.sort : undefined;

        let included = all.filter(({ item, ancestors }) => {
          try {
            return !!include(item, ancestors);
          } catch {
            return false;
          }
        });

        // Sort within the group only if a sort closure is provided.
        // sort receives { item, ancestors }
        if (sortFn) {
          included = [...included].sort((a, b) => {
            try {
              return sortFn(
                { item: a.item, ancestors: a.ancestors },
                { item: b.item, ancestors: b.ancestors }
              );
            } catch {
              return 0;
            }
          });
        }

        return included.length
          ? { key: `rule-${idx}`, title, items: included }
          : null;
      })
      .filter(Boolean);
  }, [all, groupRules]);

  const render =
    typeof renderItem === "function" ? renderItem : () => null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          px: 2,
          py: 2,
        }}
      >
        <Grid container spacing={2} sx={{ minWidth: 0 }}>
          {groups.map((g) => (
            <Grid key={g.key} size={12} sx={{ minWidth: 0 }}>
              <Section elevation={0} sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    boxSizing: "border-box",
                    background: safeAlpha(
                      theme?.palette?.text?.primary ?? "#111",
                      theme?.palette?.mode === "dark" ? 0.06 : 0.04
                    ),
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g.title ?? ""}
                    </Typography>

                    <Chip
                      size="small"
                      label={`${(g.items || []).length}`}
                      sx={{ opacity: 0.85, flex: "0 0 auto" }}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box sx={{ p: 2, boxSizing: "border-box" }}>
                  <Stack spacing={1.25} sx={{ minWidth: 0 }}>
                    {(Array.isArray(g.items) ? g.items : []).map(
                      ({ item, ancestors }, idx) => (
                        <React.Fragment key={`${g.key}-${idx}`}>
                          {render(item, ancestors)}
                        </React.Fragment>
                      )
                    )}
                  </Stack>
                </Box>
              </Section>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
