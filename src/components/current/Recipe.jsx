import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import styled from "@mui/system/styled";
import {
  Avatar,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

/**
 * Defensive helpers (theme may be undefined, data may be partial/undefined)
 */
const FALLBACK = {
  divider: "rgba(0,0,0,0.12)",
  paper: "#fff",
  textSecondary: "rgba(0,0,0,0.6)",
  bgSubtle: "rgba(0,0,0,0.03)",
};

function tDivider(theme) {
  return theme?.palette?.divider ?? FALLBACK.divider;
}
function tPaper(theme) {
  return theme?.palette?.background?.paper ?? FALLBACK.paper;
}
function tTextSecondary(theme) {
  return theme?.palette?.text?.secondary ?? FALLBACK.textSecondary;
}
function spacing(theme, n) {
  if (typeof theme?.spacing === "function") return theme.spacing(n);
  return `${n * 8}px`;
}
function safeArray(v) {
  return Array.isArray(v) ? v : [];
}
function safeStr(v, fallback = "") {
  return typeof v === "string" ? v : fallback;
}
function safeHref(href) {
  if (!href || typeof href !== "string") return undefined;
  if (href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://")) return href;
  return undefined;
}
function asNumberOrNull(v) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

/**
 * Layout + overflow hygiene notes:
 * - Grid spacing uses negative margins; to prevent accidental horizontal scrollbars,
 *   the page shell clips/hidden overflow-x.
 * - minWidth: 0 on grid items prevents long text from forcing overflow.
 * - boxSizing: border-box on the root avoids padding width bugs.
 */
const Page = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  boxSizing: "border-box",
  background: theme?.palette?.background?.default ?? "transparent",
}));

const Shell = styled("div")(({ theme }) => ({
  maxWidth: 1200,
  width: "100%",
  margin: "0 auto",
  padding: spacing(theme, 2),
  boxSizing: "border-box",
  overflowX: "clip", // best-effort clip; Page also hides overflow-x
}));

const HeroImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  height: "auto",
  borderRadius: 16,
  display: "block",
  objectFit: "cover",
  border: `1px solid ${tDivider(theme)}`,
}));

const Card = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${tDivider(theme)}`,
  boxShadow: "none",
  padding: spacing(theme, 2),
  background: tPaper(theme),
  boxSizing: "border-box",
  minWidth: 0,
}));

const CircleImg = styled("img")(({ theme }) => ({
  width: 84,
  height: 84,
  borderRadius: 999,
  objectFit: "cover",
  border: `1px solid ${tDivider(theme)}`,
  display: "block",
  maxWidth: "100%",
}));

const SmallLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.6,
  color: tTextSecondary(theme),
}));

function NutritionLine({ nutrition }) {
  const calories = asNumberOrNull(nutrition?.calories);
  const fat = asNumberOrNull(nutrition?.fat);
  const proteins = asNumberOrNull(nutrition?.proteins);
  const carbs = asNumberOrNull(nutrition?.carbs);

  const parts = [
    calories != null ? `Calories ${calories}` : null,
    fat != null ? `Fat ${fat}` : null,
    proteins != null ? `Proteins ${proteins}` : null,
    carbs != null ? `Carbs ${carbs}` : null,
  ].filter(Boolean);

  if (!parts.length) return null;

  return (
    <Typography variant="body2" sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
      {parts.join(", ")}
    </Typography>
  );
}

function SpecRow({ label, children, hideDivider }) {
  return (
    <Box sx={{ py: 1.25, minWidth: 0 }}>
      <SmallLabel variant="caption">{label}</SmallLabel>
      <Box sx={{ mt: 0.5, minWidth: 0 }}>{children}</Box>
      {!hideDivider ? <Divider sx={{ mt: 1.25 }} /> : null}
    </Box>
  );
}

export default function RecipePage({ data: recipe }) {
  const hero = recipe.hero_image ?? {};
  const author = recipe.author ?? {};
  const specs = recipe.specs ?? {};
  const ingredients = recipe.ingredients ?? {};

  const labels = safeArray(recipe.labels);
  const steps = safeArray(recipe.steps);
  const whatWeSend = safeArray(ingredients.what_we_send);
  const whatYoullNeed = safeArray(ingredients.what_youll_need);
  const whatYoullUse = safeArray(ingredients.what_youll_use);
  const notes = safeArray(recipe.notes);

  const title = safeStr(recipe.title, "Recipe");
  const subtitle = safeStr(recipe.subtitle);

  return (
    <Page>
      <Shell>
        {/* Header */}
        <Box sx={{ overflowX: "clip" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }} sx={{ minWidth: 0 }}>
              {hero.url ? (
                <HeroImage
                  src={hero.url}
                  alt={safeStr(hero.alt, `${title}${subtitle ? ` ${subtitle}` : ""}`)}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 180, sm: 260, md: 320 },
                    borderRadius: 2,
                    border: `1px solid ${FALLBACK.divider}`,
                    background: FALLBACK.bgSubtle,
                  }}
                />
              )}
            </Grid>

            {/* Left: description */}
            <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
              <Stack spacing={2} sx={{ minWidth: 0 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, lineHeight: 1.1, wordBreak: "break-word" }}
                  >
                    {title}
                    {subtitle ? (
                      <Typography
                        component="span"
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.1,
                          display: "block",
                          opacity: 0.8,
                          wordBreak: "break-word",
                        }}
                      >
                        {subtitle}
                      </Typography>
                    ) : null}
                  </Typography>

                  {labels.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mt: 1.25, minWidth: 0 }}
                    >
                      {labels.map((l, idx) => (
                        <Chip key={`${l}-${idx}`} label={safeStr(l, "label")} size="small" />
                      ))}
                    </Stack>
                  ) : null}
                </Box>

                <Card>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    What&apos;s cooking
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.7, wordBreak: "break-word" }}
                  >
                    {safeStr(recipe.whats_cooking, "—")}
                  </Typography>
                </Card>

                {(author?.name || author?.avatar_thumb_url) && (
                  <Card>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                      <Avatar
                        src={author.avatar_thumb_url || undefined}
                        alt={safeStr(author.name, "Author")}
                        sx={{ width: 56, height: 56, flex: "0 0 auto" }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Shared with you by:
                        </Typography>
                        {author.profile_path ? (
                          <Link
                            href={safeHref(author.profile_path)}
                            underline="hover"
                            sx={{ wordBreak: "break-word" }}
                          >
                            {safeStr(author.name, "Author")}
                          </Link>
                        ) : (
                          <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                            {safeStr(author.name, "Author")}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Grid>

            {/* Right: specs */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
              <Card>
                <Stack spacing={1} sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      borderRadius: 999,
                      border: `1px solid ${FALLBACK.divider}`,
                      px: 2,
                      py: 1,
                      textAlign: "center",
                      fontWeight: 700,
                      userSelect: "none",
                    }}
                  >
                    Start cooking now
                  </Box>

                  <Divider />

                  <SpecRow label="Serving Time">
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {safeStr(specs.serving_time, "—")}
                    </Typography>
                  </SpecRow>

                  <SpecRow label="Level">
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {safeStr(specs.level, "—")}
                    </Typography>
                  </SpecRow>

                  <SpecRow label="Nutrition per serving">
                    <NutritionLine nutrition={specs.nutrition_per_serving} />
                    {!specs?.nutrition_per_serving ? (
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        —
                      </Typography>
                    ) : null}
                  </SpecRow>

                  <SpecRow label="Allergens" hideDivider={!specs.ingredient_info_link}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
                      {safeStr(specs.allergens, "—")}
                    </Typography>
                  </SpecRow>

                  {specs.ingredient_info_link ? (
                    <Box sx={{ pt: 0.75, minWidth: 0 }}>
                      <Link
                        href={safeHref(specs.ingredient_info_link)}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ wordBreak: "break-word" }}
                      >
                        View ingredient information
                      </Link>
                    </Box>
                  ) : null}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Ingredients */}
        <Box sx={{ mt: 2, overflowX: "clip" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
              <Card>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  What we send
                </Typography>

                <Grid container spacing={2}>
                  {whatWeSend.length ? (
                    whatWeSend.map((ing, idx) => (
                      <Grid
                        key={`${safeStr(ing?.item, "ingredient")}-${idx}`}
                        size={{ xs: 6, sm: 4, md: 3 }}
                        sx={{ minWidth: 0 }}
                      >
                        <Stack spacing={1} alignItems="center" sx={{ textAlign: "center", minWidth: 0 }}>
                          {ing?.image_url ? (
                            <CircleImg
                              src={ing.image_url}
                              alt={safeStr(ing.alt, safeStr(ing.item, "Ingredient"))}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 84,
                                height: 84,
                                borderRadius: 999,
                                border: `1px solid ${FALLBACK.divider}`,
                                background: FALLBACK.bgSubtle,
                              }}
                            />
                          )}

                          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                            {safeStr(ing?.item, "—")}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))
                  ) : (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        No ingredients listed.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
              <Stack spacing={2} sx={{ minWidth: 0 }}>
                <Card>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    What you&apos;ll need
                  </Typography>
                  {whatYoullNeed.length ? (
                    <List dense sx={{ mt: 0.5 }}>
                      {whatYoullNeed.map((x, i) => (
                        <ListItem key={`${safeStr(x, "need")}-${i}`} disableGutters sx={{ py: 0.25 }}>
                          <ListItemText
                            primaryTypographyProps={{ variant: "body2", sx: { wordBreak: "break-word" } }}
                            primary={safeStr(x, "—")}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                      —
                    </Typography>
                  )}
                </Card>

                <Card>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    What you&apos;ll use
                  </Typography>
                  {whatYoullUse.length ? (
                    <List dense sx={{ mt: 0.5 }}>
                      {whatYoullUse.map((x, i) => (
                        <ListItem key={`${safeStr(x, "tool")}-${i}`} disableGutters sx={{ py: 0.25 }}>
                          <ListItemText
                            primaryTypographyProps={{ variant: "body2", sx: { wordBreak: "break-word" } }}
                            primary={safeStr(x, "—")}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                      —
                    </Typography>
                  )}
                </Card>

                {notes.length ? (
                  <Card>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Note
                    </Typography>
                    {notes.map((n, i) => (
                      <Typography key={i} variant="body2" sx={{ mt: i === 0 ? 1 : 0.75, wordBreak: "break-word" }}>
                        {safeStr(n, "")}
                      </Typography>
                    ))}
                  </Card>
                ) : null}

                {recipe.cooking_tip ? (
                  <Card>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Cooking tip
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, whiteSpace: "pre-wrap", lineHeight: 1.6, wordBreak: "break-word" }}
                    >
                      {safeStr(recipe.cooking_tip, "—")}
                    </Typography>
                  </Card>
                ) : null}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Steps */}
        <Box sx={{ mt: 3, overflowX: "clip" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, wordBreak: "break-word" }}>
            Cook this recipe in {steps.length} simple steps
          </Typography>

          <Grid container spacing={2}>
            {steps.length ? (
              steps.map((s, idx) => (
                <Grid
                  key={`${s?.number ?? idx}-${safeStr(s?.title, "step")}`}
                  size={{ xs: 12, sm: 6, lg: 4 }}
                  sx={{ minWidth: 0 }}
                >
                  <Card>
                    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                      {s?.image_url ? (
                        <Box
                          component="img"
                          src={s.image_url}
                          alt={safeStr(s.title, `Step ${s.number ?? idx + 1}`)}
                          sx={{
                            width: "100%",
                            maxWidth: "100%",
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: `1px solid ${FALLBACK.divider}`,
                            display: "block",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: 200,
                            borderRadius: 2,
                            border: `1px solid ${FALLBACK.divider}`,
                            background: FALLBACK.bgSubtle,
                          }}
                        />
                      )}

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, wordBreak: "break-word" }}>
                          {s?.number != null ? `${s.number}. ` : ""}
                          {safeStr(s?.title, "Step")}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7, wordBreak: "break-word" }}
                        >
                          {safeStr(s?.instructions, "—")}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No steps provided.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Shell>
    </Page>
  );
}
