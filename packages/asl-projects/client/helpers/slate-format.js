export const slateFormat = (value) => {
  return {
    "object": "value",
    "document": {
    "data": {},
    "nodes": [
      {
        "data": {},
        "type": "paragraph",
        "nodes": [
          {
            "text": value,
            "marks": [],
            "object": "text"
          }
        ],
        "object": "block"
      }
    ],
      "object": "document"
  }
  }
}
