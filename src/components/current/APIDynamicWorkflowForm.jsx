import * as React from "react";
import Box from "@mui/system/Box";
import { Alert } from "@mui/material";
import DynamicWorkflowForm from "./DynamicWorkflowForm";

/**
 * No parameters.
 * Hardcodes stepKey -> fields mapping.
 * Owns resumeUrl + stepKey.
 * API contract (minimal):
 * - POST /api/workflow/start  -> { resumeUrl?: string, nextKey?: string, done?: boolean }
 * - POST resumeUrl            -> { resumeUrl?: string, nextKey?: string, done?: boolean }
 */
export default function APIDynamicWorkflowForm() {
  // stepKey -> fields is hardcoded here
  const FIELDS_BY_KEY = React.useMemo(
    () => ({
      start: [
        { title: "URL", placeholder: "", key: "url" },
        { title: "File Name", placeholder: "", key: "fileName" },
      ],
      yaml: [
        { title: "YAML", placeholder: "", key: "yaml" },
      ],
      done: [],
    }),
    []
  );

  const [stepKey, setStepKey] = React.useState("start");
  const [resumeUrl, setResumeUrl] = React.useState(null);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");
  const [input, setInput] = React.useState({})

  const fields = FIELDS_BY_KEY[stepKey] ?? [];

  const handleSubmit = async (values) => {
    console.log(values)
    if(stepKey === 'start') {
      try {
        const r = await fetch("https://n8n-digitalsymphony.ngrok.pizza/webhook/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!r.ok) throw new Error(`Start failed (${r.status})`);
        const result = await r.json();
        if(result.yaml) {
            setResumeUrl(result.yaml)
            setInput({html: result.html})
            setStepKey('yaml')
        }
        console.log(result)
        console.log("API Response:", result);
      } catch (e) {
        console.error("Error:", e);
      }
    } else if(stepKey === 'yaml') {
       const r = await fetch("https://api-digitalsymphony.ngrok.pizza/react/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({data: values, resumeURL: resumeUrl}),
        });
        if (!r.ok) throw new Error(`Start failed (${r.status})`);
        const result = await r.json();
        if(result.done) {
            setDone(true)
            setStepKey('done')
        }
    }
    //     : await resumeWorkflow(resumeUrl, values);

    //   if (result?.resumeUrl) setResumeUrl(String(result.resumeUrl));

    //   if (result?.done === true) {
    //     setDone(true);
    //     setStepKey("done");
    //     return;
    //   }

    //   if (result?.nextKey) {
    //     setStepKey(String(result.nextKey));
    //     return;
    //   }

    //   // If API doesn't provide nextKey, keep current stepKey
    // } catch (e) {
    //   setError(e?.message ? String(e.message) : "Submit failed.");
    // }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {error ? <Alert severity="error">{error}</Alert> : null}

      {done ? (
        <Alert severity="success">Done</Alert>
      ) : (
        <DynamicWorkflowForm
          title={stepKey}
          fields={fields}
          onSubmit={handleSubmit}
          input={input}
        />
      )}
    </Box>
  );
}
