import LiveSetTrackExplorer from './LiveSetTrackExplorer';

const meta = {
  component: LiveSetTrackExplorer,
};

export default meta;

export const Default = {
  render() {
    const data = {
      "type": "live_set",
      "trackCount": 16,
      "tracks": [
        {
          "index": 0,
          "name": "API Gateway",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 0 devices 0",
              "name": "LiveGateway",
              "class_name": "MxDeviceMidiEffect",
              "can_have_chains": 0
            }
          ]
        },
        {
          "index": 1,
          "name": "Parts",
          "deviceCount": 0,
          "devices": []
        },
        {
          "index": 2,
          "name": "3-Drum Rack",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 2 devices 0",
              "name": "Drum Rack",
              "class_name": "DrumGroupDevice",
              "can_have_chains": 1,
              "chainCount": 42,
              "chains": [
                {
                  "index": 0,
                  "name": "Kick",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 0 devices 0",
                      "name": "Kick",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 1,
                  "name": "Shaker Chain",
                  "deviceCount": 2,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 1 devices 0",
                      "name": "NoteHolder",
                      "class_name": "MxDeviceMidiEffect",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 2 devices 0 chains 1 devices 1",
                      "name": "Clap",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 2,
                  "name": "finger clap",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 2 devices 0",
                      "name": "finger clap",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 3,
                  "name": "knock",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 3 devices 0",
                      "name": "knock",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 4,
                  "name": "shake",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 4 devices 0",
                      "name": "shake",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 5,
                  "name": "Chords Gate",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 5 devices 0",
                      "name": "Instrument Rack",
                      "class_name": "InstrumentGroupDevice",
                      "can_have_chains": 1,
                      "chainCount": 1,
                      "chains": [
                        {
                          "index": 0,
                          "name": "Clap",
                          "deviceCount": 2,
                          "devices": [
                            {
                              "path": "live_set tracks 2 devices 0 chains 5 devices 0 chains 0 devices 0",
                              "name": "NoteHolder",
                              "class_name": "MxDeviceMidiEffect",
                              "can_have_chains": 0
                            },
                            {
                              "path": "live_set tracks 2 devices 0 chains 5 devices 0 chains 0 devices 1",
                              "name": "Clap",
                              "class_name": "OriginalSimpler",
                              "can_have_chains": 0
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "index": 6,
                  "name": "Guitar Gate",
                  "deviceCount": 2,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 6 devices 0",
                      "name": "NoteHolder",
                      "class_name": "MxDeviceMidiEffect",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 2 devices 0 chains 6 devices 1",
                      "name": "Clap",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 7,
                  "name": "Bass Gate",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 7 devices 0",
                      "name": "Clap",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 8,
                  "name": "OS_VV5_snare_beef",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 8 devices 0",
                      "name": "OS_VV5_snare_beef",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 9,
                  "name": "Slice 1",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 9 devices 0",
                      "name": "Slice 1",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 10,
                  "name": "Slice 2",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 10 devices 0",
                      "name": "Slice 2",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 11,
                  "name": "Slice 1",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 11 devices 0",
                      "name": "Slice 1",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 12,
                  "name": "Slice 2",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 12 devices 0",
                      "name": "Slice 2",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 13,
                  "name": "Slice 3",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 13 devices 0",
                      "name": "Slice 3",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 14,
                  "name": "Slice 4",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 14 devices 0",
                      "name": "Slice 4",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 15,
                  "name": "Slice 3",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 15 devices 0",
                      "name": "Slice 3",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 16,
                  "name": "Slice 4",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 16 devices 0",
                      "name": "Slice 4",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 17,
                  "name": "Slice 5",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 17 devices 0",
                      "name": "Slice 5",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 18,
                  "name": "Slice 6",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 18 devices 0",
                      "name": "Slice 6",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 19,
                  "name": "Slice 5",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 19 devices 0",
                      "name": "Slice 5",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 20,
                  "name": "Slice 6",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 20 devices 0",
                      "name": "Slice 6",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 21,
                  "name": "Slice 7",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 21 devices 0",
                      "name": "Slice 7",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 22,
                  "name": "Slice 8",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 22 devices 0",
                      "name": "Slice 8",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 23,
                  "name": "Slice 7",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 23 devices 0",
                      "name": "Slice 7",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 24,
                  "name": "Slice 8",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 24 devices 0",
                      "name": "Slice 8",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 25,
                  "name": "Slice 9",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 25 devices 0",
                      "name": "Slice 9",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 26,
                  "name": "Slice 10",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 26 devices 0",
                      "name": "Slice 10",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 27,
                  "name": "Instrument Rack",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 27 devices 0",
                      "name": "Instrument Rack",
                      "class_name": "InstrumentGroupDevice",
                      "can_have_chains": 1,
                      "chainCount": 2,
                      "chains": [
                        {
                          "index": 0,
                          "name": "Slice 9",
                          "deviceCount": 1,
                          "devices": [
                            {
                              "path": "live_set tracks 2 devices 0 chains 27 devices 0 chains 0 devices 0",
                              "name": "Slice 9",
                              "class_name": "OriginalSimpler",
                              "can_have_chains": 0
                            }
                          ]
                        },
                        {
                          "index": 1,
                          "name": "Slice 9",
                          "deviceCount": 1,
                          "devices": [
                            {
                              "path": "live_set tracks 2 devices 0 chains 27 devices 0 chains 1 devices 0",
                              "name": "Slice 9",
                              "class_name": "OriginalSimpler",
                              "can_have_chains": 0
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "index": 28,
                  "name": "Slice 10",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 28 devices 0",
                      "name": "Slice 10",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 29,
                  "name": "Slice 11",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 29 devices 0",
                      "name": "Slice 11",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 30,
                  "name": "Slice 12",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 30 devices 0",
                      "name": "Slice 12",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 31,
                  "name": "Slice 11",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 31 devices 0",
                      "name": "Slice 11",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 32,
                  "name": "Slice 12",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 32 devices 0",
                      "name": "Slice 12",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 33,
                  "name": "Slice 13",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 33 devices 0",
                      "name": "Slice 13",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 34,
                  "name": "Slice 14",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 34 devices 0",
                      "name": "Slice 14",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 35,
                  "name": "Slice 13",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 35 devices 0",
                      "name": "Slice 13",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 36,
                  "name": "Slice 14",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 36 devices 0",
                      "name": "Slice 14",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 37,
                  "name": "Slice 15",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 37 devices 0",
                      "name": "Slice 15",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 38,
                  "name": "Slice 16",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 38 devices 0",
                      "name": "Slice 16",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 39,
                  "name": "Slice 15",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 39 devices 0",
                      "name": "Slice 15",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 40,
                  "name": "Slice 16",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 40 devices 0",
                      "name": "Slice 16",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 41,
                  "name": "ABC",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 2 devices 0 chains 41 devices 0",
                      "name": "Instrument Rack",
                      "class_name": "InstrumentGroupDevice",
                      "can_have_chains": 1,
                      "chainCount": 0,
                      "chains": []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 3,
          "name": "guitar",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 3 devices 0",
              "name": "guitar",
              "class_name": "DrumGroupDevice",
              "can_have_chains": 1,
              "chainCount": 16,
              "chains": [
                {
                  "index": 0,
                  "name": "Slice 1",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 0 devices 0",
                      "name": "Slice 1",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 1,
                  "name": "Slice 2",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 1 devices 0",
                      "name": "Slice 2",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 2,
                  "name": "Slice 3",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 2 devices 0",
                      "name": "Slice 3",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 3,
                  "name": "Slice 4",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 3 devices 0",
                      "name": "Slice 4",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 4,
                  "name": "Slice 5",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 4 devices 0",
                      "name": "Slice 5",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 5,
                  "name": "Slice 6",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 5 devices 0",
                      "name": "Slice 6",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 6,
                  "name": "Slice 7",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 6 devices 0",
                      "name": "Slice 7",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 7,
                  "name": "Slice 8",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 7 devices 0",
                      "name": "Slice 8",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 8,
                  "name": "Slice 9",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 8 devices 0",
                      "name": "Slice 9",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 9,
                  "name": "Slice 10",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 9 devices 0",
                      "name": "Slice 10",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 10,
                  "name": "Slice 11",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 10 devices 0",
                      "name": "Slice 11",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 11,
                  "name": "Slice 12",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 11 devices 0",
                      "name": "Slice 12",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 12,
                  "name": "Slice 13",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 12 devices 0",
                      "name": "Slice 13",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 13,
                  "name": "Slice 14",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 13 devices 0",
                      "name": "Slice 14",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 14,
                  "name": "Slice 15",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 14 devices 0",
                      "name": "Slice 15",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 15,
                  "name": "Slice 16",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 3 devices 0 chains 15 devices 0",
                      "name": "Slice 16",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 4,
          "name": "5-Bass Basic",
          "deviceCount": 3,
          "devices": [
            {
              "path": "live_set tracks 4 devices 0",
              "name": "Bass Basic",
              "class_name": "InstrumentGroupDevice",
              "can_have_chains": 1,
              "chainCount": 1,
              "chains": [
                {
                  "index": 0,
                  "name": "Serum 2",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 4 devices 0 chains 0 devices 0",
                      "name": "Serum 2",
                      "class_name": "PluginDevice",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            },
            {
              "path": "live_set tracks 4 devices 1",
              "name": "Compressor",
              "class_name": "Compressor2",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 4 devices 2",
              "name": "Gate",
              "class_name": "Gate",
              "can_have_chains": 0
            }
          ]
        },
        {
          "index": 5,
          "name": "Chords",
          "deviceCount": 5,
          "devices": [
            {
              "path": "live_set tracks 5 devices 0",
              "name": "Serum 2",
              "class_name": "PluginDevice",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 5 devices 1",
              "name": "Serum 2 FX",
              "class_name": "PluginDevice",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 5 devices 2",
              "name": "Compressor",
              "class_name": "Compressor2",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 5 devices 3",
              "name": "Compressor",
              "class_name": "Compressor2",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 5 devices 4",
              "name": "Gate",
              "class_name": "Gate",
              "can_have_chains": 0
            }
          ]
        },
        {
          "index": 6,
          "name": "7-TS_VV_80_tamborine_ride_rims",
          "deviceCount": 3,
          "devices": [
            {
              "path": "live_set tracks 6 devices 0",
              "name": "Compressor",
              "class_name": "Compressor2",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 6 devices 1",
              "name": "Serum 2 FX",
              "class_name": "PluginDevice",
              "can_have_chains": 0
            },
            {
              "path": "live_set tracks 6 devices 2",
              "name": "Gate",
              "class_name": "Gate",
              "can_have_chains": 0
            }
          ]
        },
        {
          "index": 7,
          "name": "Guitar",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 7 devices 0",
              "name": "Instrument Rack",
              "class_name": "InstrumentGroupDevice",
              "can_have_chains": 1,
              "chainCount": 1,
              "chains": [
                {
                  "index": 0,
                  "name": "Serum 2",
                  "deviceCount": 5,
                  "devices": [
                    {
                      "path": "live_set tracks 7 devices 0 chains 0 devices 0",
                      "name": "Serum 2",
                      "class_name": "PluginDevice",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 7 devices 0 chains 0 devices 1",
                      "name": "FabFilter Pro-Q 4",
                      "class_name": "PluginDevice",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 7 devices 0 chains 0 devices 2",
                      "name": "Serum 2 FX",
                      "class_name": "PluginDevice",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 7 devices 0 chains 0 devices 3",
                      "name": "Compressor",
                      "class_name": "Compressor2",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 7 devices 0 chains 0 devices 4",
                      "name": "Gate",
                      "class_name": "Gate",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 8,
          "name": "Vox - Piano",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 8 devices 0",
              "name": "Instrument Rack",
              "class_name": "InstrumentGroupDevice",
              "can_have_chains": 1,
              "chainCount": 1,
              "chains": [
                {
                  "index": 0,
                  "name": "Serum 2",
                  "deviceCount": 2,
                  "devices": [
                    {
                      "path": "live_set tracks 8 devices 0 chains 0 devices 0",
                      "name": "Pitch",
                      "class_name": "MidiPitcher",
                      "can_have_chains": 0
                    },
                    {
                      "path": "live_set tracks 8 devices 0 chains 0 devices 1",
                      "name": "Serum 2",
                      "class_name": "PluginDevice",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 9,
          "name": "Sidechainer",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 9 devices 0",
              "name": "Drum Rack",
              "class_name": "DrumGroupDevice",
              "can_have_chains": 1,
              "chainCount": 1,
              "chains": [
                {
                  "index": 0,
                  "name": "Kick",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 9 devices 0 chains 0 devices 0",
                      "name": "Kick",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 10,
          "name": "Pluck",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 10 devices 0",
              "name": "Serum 2",
              "class_name": "PluginDevice",
              "can_have_chains": 0
            }
          ]
        },
        {
          "index": 11,
          "name": "12-Alan Walker & Alosa - Lily (Lyrics)",
          "deviceCount": 0,
          "devices": []
        },
        {
          "index": 12,
          "name": "13-chords v2",
          "deviceCount": 0,
          "devices": []
        },
        {
          "index": 13,
          "name": "chords v2",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 13 devices 0",
              "name": "chords v2",
              "class_name": "DrumGroupDevice",
              "can_have_chains": 1,
              "chainCount": 8,
              "chains": [
                {
                  "index": 0,
                  "name": "Slice 1",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 0 devices 0",
                      "name": "Slice 1",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 1,
                  "name": "Slice 2",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 1 devices 0",
                      "name": "Slice 2",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 2,
                  "name": "Slice 3",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 2 devices 0",
                      "name": "Slice 3",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 3,
                  "name": "Slice 4",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 3 devices 0",
                      "name": "Slice 4",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 4,
                  "name": "Slice 5",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 4 devices 0",
                      "name": "Slice 5",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 5,
                  "name": "Slice 6",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 5 devices 0",
                      "name": "Slice 6",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 6,
                  "name": "Slice 7",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 6 devices 0",
                      "name": "Slice 7",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                },
                {
                  "index": 7,
                  "name": "Slice 8",
                  "deviceCount": 1,
                  "devices": [
                    {
                      "path": "live_set tracks 13 devices 0 chains 7 devices 0",
                      "name": "Slice 8",
                      "class_name": "OriginalSimpler",
                      "can_have_chains": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "index": 14,
          "name": "15-guitar",
          "deviceCount": 0,
          "devices": []
        },
        {
          "index": 15,
          "name": "Wash",
          "deviceCount": 1,
          "devices": [
            {
              "path": "live_set tracks 15 devices 0",
              "name": "DS_MPH_fx_transition_one_shot_wash",
              "class_name": "OriginalSimpler",
              "can_have_chains": 0
            }
          ]
        }
      ]
    }
    return <LiveSetTrackExplorer data={data} />;
  }

};