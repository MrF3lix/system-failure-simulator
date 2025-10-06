import { createContext } from "react";


export const GraphContext = createContext({
  successRates: {},
  setSuccessRates: () => {},
  conditionalProbabilities: {},
  setConditionalProbabilities: () => {}
});


export const initFromDependencyGraph = (dependencyGraph) => {

}

export const parseLabel = (label) => {
  // Split node name from binary value, e.g. "q1" -> ["q", "1"]
  const match = label.match(/(.+)([01])$/);
  if (!match) {
    throw new Error(`Invalid label: ${label}`);
  }
  return match[1]; // just the node name
}

export const inferDependencyGraph = (conditionalProbs) => {
  const graph = {};

  for (const [node, config] of Object.entries(conditionalProbs)) {
    const p = config.p;
    if (typeof p === "number") {
      // unconditional -> no parents
      graph[node] = [];
    } else {
      const deps = new Set();
      for (const condKey of Object.keys(p)) {
        const labels = condKey.split("_"); // e.g. "r1_q0" -> ["r1", "q0"]
        for (const label of labels) {
          deps.add(parseLabel(label));
        }
      }
      graph[node] = Array.from(deps).sort();
    }
  }

  return graph;
}