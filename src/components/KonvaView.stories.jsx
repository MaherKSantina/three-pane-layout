import { useEffect, useRef } from 'react';
import KonvaView from './KonvaView';

const meta = {
  component: KonvaView,
};

export default meta;

const rectWidth = 100
const rectHeight = 80
const arcHeight = 100
const padding = 50
const lineLength = 200

function getRequestJ(req, index = 0) {
        if(req.chainResponse) {
          return getResponseJ(req.chainResponse, index + 1)
        } else if(req.previousRequest) {
          return getRequestJ(req.previousRequest, index)
        } else {
          return index
        }
      }

      function getResponseJ(res, index = 0) {
        if(res.request) {
          return getRequestJ(res.request, index + 1)
        } else if(res.previousResponse) {
          return getResponseJ(res.previousResponse, index)
        }
      }

function handleRequest(req, index = 0) {
      if(req.agent) {
        return index
      } else if(req.previousRequest) {
        return handleRequest(req.previousRequest, index + 1)
      } else if(req.chainResponse) {
        return handleResponse(req.chainResponse, index)
      }
    }
    function handleResponse(res, index = 0) {
      if(res.request) {
        return handleRequest(res.request, index)
      } else if(res.previousResponse) {
        return handleResponse(res.previousResponse, index - 1)
      }
    }

function getResponseI(response) {
    return handleResponse(response)
  }

  function getRequestI(request){
    return handleRequest(request)
  }

function getRequestStart(request) {
  if(request.previousRequest) {
    return getRequestStart(request.previousRequest)
  } else if(request.chainResponse) {
    return getResponseStart(request.chainResponse)
  } else {
    return request.agent.start
  }
}

function getResponseStart(response) {
  if(response.previousResponse) {
    return getResponseStart(response.previousResponse)
  } else {
    return getRequestStart(response.request)
  }
}

function getResponseRequest(response) {
  if(response.request) {
    return response.request
  } else {
    return getResponseRequest(response.previousResponse)
  }
}

function getRequestIndex(req, index = 1) {
    if(req.previousRequest) {
      return getRequestIndex(req.previousRequest, index + 1)
    } else if(req.chainResponse) {
      return getResponseIndex(req.chainResponse, index + 1)
    }  else {
      return index
    }
  }

  function getResponseIndex(res, index = 1) {
    if(res.request) {
      return index
    } else {
      return getResponseIndex(res.previousResponse, index + 1)
    }
  }

  function getRequestChainLength(req, index = 0) {
    if(req.chainResponse) {
      return getResponseChainLength(req.chainResponse, index + 1)
    } else if(req.chainRequest) {
      return getRequestChainLength(req.previousRequest, index)
    } else {
      return index
    }
  }

  function getResponseChainLength(res, index = 0) {
    if(res.previousResponse) {
      return getResponseChainLength(res.previousResponse, index)
    } else if(res.request) {
      return getRequestChainLength(res.request, index + 1)
    }
  }

  function drawRequest(request, layer, konvaRef) {
    let { x, y } = getRequestStart(request)
    let i = getRequestI(request)
    let j = getRequestJ(request)
    x = x + i * (lineLength + padding + rectWidth)
    y = y + (j) * (arcHeight)
    if(request.chainResponse) {
      konvaRef.current.addLine(layer, [
        { x: x + lineLength - rectWidth, y: y - arcHeight + rectHeight / 2 },
        {
          x: x + lineLength - rectWidth, y: y - arcHeight + rectHeight / 2 + arcHeight, type: 'curve',
          cp1x: x + lineLength - rectWidth - arcHeight * 0.75, cp1y: y - arcHeight + rectHeight / 2,
          cp2x: x + lineLength - rectWidth - arcHeight * 0.75, cp2y: y - arcHeight + rectHeight / 2 + arcHeight
        },
        // {x: x, y: y + rectHeight / 2 + arcHeight, type: "line" }
      ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })

      konvaRef.current.addLine(layer, [
        {x: x + lineLength - rectWidth, y: y - arcHeight + rectHeight / 2 + arcHeight},
        {x: x + lineLength - rectWidth + rectWidth + padding, y: y - arcHeight + rectHeight / 2 + arcHeight, type: "line" },
      ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })

      konvaRef.current.addShape(layer, "rect", {
        x: x + lineLength - rectWidth + rectWidth + padding,
        y: y - arcHeight + arcHeight,
        width: rectWidth,
        height: rectHeight,
        fill: "skyblue",
        stroke: "black",
        strokeWidth: 2,
      });
      konvaRef.current.addText(layer, request.text, {
        x: x + lineLength - rectWidth + rectWidth + padding,
        y: y - arcHeight + arcHeight,
        width: rectWidth,
        height: rectHeight,
      })

      konvaRef.current.addLine(layer, [
        {x: x + lineLength - rectWidth + rectWidth + padding / 2, y: y - arcHeight + arcHeight},
        {x: x + lineLength - rectWidth + rectWidth + padding / 2, y: y - arcHeight + arcHeight + rectHeight + arcHeight, type: "line" },
      ], { stroke: 'black', strokeWidth: 2, lineCap: 'round', dash: [2, 6] })
    } else {
      konvaRef.current.addLine(layer, [
        {x, y: y + rectHeight / 2},
        {x: x + lineLength + padding, y: y + rectHeight / 2, type: "line" },
      ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })

      konvaRef.current.addShape(layer, "rect", {
        x: x + lineLength + padding,
        y,
        width: rectWidth,
        height: rectHeight,
        fill: "skyblue",
        stroke: "black",
        strokeWidth: 2,
      });
      konvaRef.current.addText(layer, request.text, {
        x: x + lineLength + padding,
        y,
        width: rectWidth,
        height: rectHeight,
      })

      konvaRef.current.addLine(layer, [
        {x: x + lineLength + padding / 2, y},
        {x: x + lineLength + padding / 2, y: y + rectHeight + arcHeight, type: "line" },
      ], { stroke: 'black', strokeWidth: 2, lineCap: 'round', dash: [2, 6] })
    }
  }
    

function createRequest(agent, text, layer, konvaRef) {
  let request = {
    text,
    agent
  }
  agent.request = request

  drawRequest(request, layer, konvaRef)

  return request
}

function chainRequest(request, text, layer, konvaRef) {
  let newRequest = {
    text
  }
  request.request = newRequest
  newRequest.previousRequest = request

  drawRequest(newRequest, layer, konvaRef)

  return newRequest

}

function chainResponseToRequest(response, text, layer, konvaRef) {
  let newRequest = {
    text,
    chainResponse: response
  }
  response.nextRequest = newRequest
  drawRequest(newRequest, layer, konvaRef)
  return newRequest

}

function drawResponse(response, layer, konvaRef) {
let i = getResponseI(response)
  let { x, y } = getResponseStart(response)
  let requestRectStart = x + (i + 1) * (lineLength + padding + rectWidth)
  let j = getResponseJ(response)
  console.log(response.text, j)
  y = y + (j - 1) * (arcHeight)
  if(!response.previousResponse) {
    konvaRef.current.addLine(layer, [
    { x: requestRectStart, y: y + rectHeight / 2 },
    {
      x: requestRectStart, y: y + rectHeight / 2 + arcHeight, type: 'curve',
      cp1x: requestRectStart + arcHeight * 0.75, cp1y: y + rectHeight / 2,
      cp2x: requestRectStart + arcHeight * 0.75, cp2y: y + rectHeight / 2 + arcHeight
    },
    {x: requestRectStart, y: y + rectHeight / 2 + arcHeight, type: "line" }
  ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })
  } else {
    konvaRef.current.addLine(layer, [
    { x: requestRectStart + rectWidth, y: y + rectHeight / 2 + arcHeight },
    {x: requestRectStart, y: y + rectHeight / 2 + arcHeight, type: "line" }
    // {x: x + secondaryStartXInverse, y: y + rectHeight / 2 + arcHeight, type: "line"}
  ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })
  }
  

  konvaRef.current.addLine(layer, [
    {x: requestRectStart, y: y + rectHeight / 2 + arcHeight},
    {x: requestRectStart - rectWidth - padding, y: y + rectHeight / 2 + arcHeight, type: "line" },
  ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })

  konvaRef.current.addShape(layer, "rect", {
    x: requestRectStart - rectWidth - padding - rectWidth,
    y: y + arcHeight,
    width: rectWidth,
    height: rectHeight,
    fill: "skyblue",
    stroke: "black",
    strokeWidth: 2,
  });
  konvaRef.current.addText(layer, response.text, {
    x: requestRectStart - rectWidth - padding - rectWidth,
    y: y + arcHeight,
    width: rectWidth,
    height: rectHeight,
  })
}

function createResponse(request, text, layer, konvaRef) {
  let response = {
    text,
    request
  }
  request.response = response

  drawResponse(response, layer, konvaRef)
  

  return response
}

function chainResponse(response, text, layer, konvaRef) {
  let newResponse = {
    text,
    previousResponse: response
  }
  response.response = newResponse

  drawResponse(newResponse, layer, konvaRef)

  return newResponse

}

function KV(props) {
  const konvaRef = useRef();
  let layer
  let i = 0

  useEffect(() => {
    layer = konvaRef.current.addLayer();
  }, [konvaRef])

  const handleAddRect = () => {
    let a1 = {
      start: {
        x: 100,
        y: 100
      }
    }
    let req = createRequest(a1, "R1", layer, konvaRef)
    let req2 = chainRequest(req, "R2", layer, konvaRef)
    let req3 = chainRequest(req2, "R3", layer, konvaRef)
    let res = createResponse(req3, "R3-R", layer, konvaRef)
    let res2 = chainResponse(res, "R2-R", layer, konvaRef)
    let req4 = chainResponseToRequest(res2, "R2->R1", layer, konvaRef)
    let req4_1 = chainRequest(req4, "R2->R2", layer, konvaRef)
    let res5 = createResponse(req4_1, "R2->R2-R", layer, konvaRef)
    let req6 = chainResponseToRequest(res5, "R2->R2->R1", layer, konvaRef)
    let res7 = createResponse(req6, "R2->R2->R1-R", layer, konvaRef)
    let res8 = chainResponse(res7, "R2->R1-R", layer, konvaRef)
    let res9 = chainResponse(res8, "R1-R", layer, konvaRef)

    // let a2 = {
    //   start: {
    //     x: 100,
    //     y: 400
    //   }
    // }
    // let r2 = createRequest(a2, "This is a Request", layer, konvaRef)

    // konvaRef.current.addShape(layer, "rect", {
    //   x: i * 150,
    //   y: 50,
    //   width: 100,
    //   height: 80,
    //   fill: "skyblue",
    //   stroke: "black",
    //   strokeWidth: 2,
    // });
//     konvaRef.current.addLine(layer, [
//   { x: 100, y: 100 }, // start point
//   {
//     x: 100, y: 200, type: 'curve',
//     cp1x: 175, cp1y: 100,
//     cp2x: 175, cp2y: 200
//   },
// ], { stroke: 'black', strokeWidth: 2, lineCap: 'round' })
    i++
  };

  return (
    <div>
      <button onClick={handleAddRect}>Add Rect</button>
      <KonvaView ref={konvaRef} {...props} />
    </div>
  );
}

export const Default = {
  render() {
    return <KV width={3000} height={3000} ></KV>
  }
};