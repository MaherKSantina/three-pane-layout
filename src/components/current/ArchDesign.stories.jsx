import ArchDesign from './ArchDesign';

const meta = {
  component: ArchDesign,
};

export default meta;

const data = {
  "items": [
    {
      "type": "inputDataType",
      "description": "The way the input will be passed",
      "options": [
        {
          "type": "text",
          "description": "Data will be passed as raw text"
        },
        {
          "type": "integrated",
          "description": "Data will be retrieved from specific files"
        }
      ]
    },
    {
      "type": "input",
      "options": [
        {
          "type": "postman",
          "description": "Postman will be used to interact with the system"
        },
        {
          "type": "chat",
          "description": "Chat UI will be used to interact with the system",
          "items": [
            {
              "type": "UI",
              "description": "The interface for the system"
            },
            {
              "type": "engine",
              "description": "The processing that will parse message data",
              "options": [
                {
                  "type": "map",
                  "description": "The messages will be parsed by using a map between input and operation"
                },
                {
                  "type": "mcp",
                  "description": "The messages will be parsed as natural language and converted to operations"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "queryLanguage",
      "description": "The language that will drive code querying"
    },
    {
      "type": "operations",
      "description": "The actions that can be executed against the code"
    },
    {
      "type": "Parser",
      "description": "The component that handles specialized code executions"
    },
    {
      "type": "queryView",
      "description": "The operation output presentation",
      "options": [
        {
          "type": "monaco",
          "description": "Output will be presented in a monaco editor"
        },
        {
          "type": "networkGraph",
          "description": "Output will be presented as a network graph"
        }
      ]
    },
    {
      "type": "diffHandler",
      "description": "The way that diffs will be handled",
      "options": [
        {
          "type": "view",
          "description": "Developer will see diffs as a list of non-automated actions"
        },
        {
          "type": "integrated",
          "description": "Changes will be automatically applied to the codebase"
        }
      ]
    }
  ]
}

export const Default = {
  render() {
    return <ArchDesign data={data} />;
  }
};