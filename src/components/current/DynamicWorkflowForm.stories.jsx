import DynamicWorkflowForm from './DynamicWorkflowForm';

const meta = {
  component: DynamicWorkflowForm,
};

export default meta;

export const Default = {
  render() {
    const fieldsByStep = {
  default: [
    { key: "url", title: "Recipe URL", placeholder: "https://example.com/recipe" },
    { key: "fileName", title: "File Name", placeholder: "chicken-veggie-couscous" },
  ],
  review: [
    { key: "notes", title: "Review notes", placeholder: "What did you find?", multiline: true },
    { key: "decision", title: "Decision", placeholder: "approve / reject" },
  ],
};

async function start(values) {
  // POST to your Express endpoint that triggers n8n and returns { resumeUrl, stepData }
  const r = await fetch("https://n8n-digitalsymphony.ngrok.pizza/webhook/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!r.ok) throw new Error(`Start failed (${r.status})`);
  return await r.json();
}

async function resume(resumeUrl, values) {
  const r = await fetch(resumeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!r.ok) throw new Error(`Resume failed (${r.status})`);
  return await r.json();
}

return <DynamicWorkflowForm
  title="My Workflow Runner"
  fieldsByStep={fieldsByStep}
  stepKey="step"      // your API should include stepData.step = "review" etc
  doneKey="done"      // your API should return done: true at the end
  start={start}
  resume={resume}
/>;
  }
};