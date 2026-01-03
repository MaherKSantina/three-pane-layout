import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import styled from "@mui/system/styled";
import { alpha, useTheme } from "@mui/material/styles";
import { Avatar, Chip, Stack, Typography } from "@mui/material";

const RowShell = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 14,
  border: `1px solid ${alpha(
    theme?.palette?.text?.primary ?? "#111",
    theme?.palette?.mode === "dark" ? 0.16 : 0.1
  )}`,
  background: alpha(
    theme?.palette?.background?.paper ?? "#fff",
    theme?.palette?.mode === "dark" ? 0.35 : 0.9
  ),
}));

function safeAlpha(color, value) {
  try {
    return alpha(color, value);
  } catch {
    return alpha("#111", value);
  }
}

/**
 * ScheduleItemView
 * Props (all optional):
 * - color
 * - symbol
 * - title
 * - subtitle (smaller grey text)
 * - isStrikedOut
 * - chips: Array<{ text: string, color?: string }>
 */
export function ScheduleItemView({
  color,
  symbol,
  title,
  subtitle,
  isStrikedOut,
  chips,
}) {
  const themeMaybe = useTheme();
  const theme = themeMaybe || {};
  const c = color || theme?.palette?.primary?.main || "#1976d2";

  const chipItems = Array.isArray(chips) ? chips : [];

  return (
    <RowShell>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          bgcolor: c,
          borderTopLeftRadius: 14,
          borderBottomLeftRadius: 14,
        }}
      />
      <Box sx={{ p: 1.5, pl: 2 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid size="auto">
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: safeAlpha(c, theme?.palette?.mode === "dark" ? 0.25 : 0.18),
                color: c,
                fontWeight: 800,
                fontSize: 12,
                border: `1px solid ${safeAlpha(c, 0.35)}`,
              }}
            >
              {symbol ?? "•"}
            </Avatar>
          </Grid>

          <Grid size={{ xs: 12, sm: "grow" }}>
            <Stack spacing={0.4} sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ minWidth: 0 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 750,
                    textDecoration: isStrikedOut ? "line-through" : "none",
                    opacity: isStrikedOut ? 0.65 : 1,
                  }}
                >
                  {title ?? "(Untitled)"}
                </Typography>

                {chipItems.map((ch, idx) => {
                  const text = ch && typeof ch.text === "string" ? ch.text : "";
                  if (!text) return null;

                  const chipColor =
                    ch && typeof ch.color === "string" && ch.color
                      ? ch.color
                      : undefined;

                  return (
                    <Chip
                      key={`${text}-${idx}`}
                      size="small"
                      label={text}
                      sx={
                        chipColor
                          ? {
                              bgcolor: safeAlpha(chipColor, theme?.palette?.mode === "dark" ? 0.22 : 0.16),
                              color: chipColor,
                              border: `1px solid ${safeAlpha(chipColor, 0.35)}`,
                            }
                          : undefined
                      }
                      variant={chipColor ? "outlined" : "filled"}
                    />
                  );
                })}
              </Stack>

              {subtitle ? (
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.72,
                    color: theme?.palette?.text?.secondary ?? "rgba(0,0,0,0.6)",
                    lineHeight: 1.35,
                  }}
                >
                  {subtitle}
                </Typography>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </RowShell>
  );
}
