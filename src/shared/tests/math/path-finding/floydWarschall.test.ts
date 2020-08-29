import { expect } from 'chai';

import { floydWarshall } from "../../../math/path-finding/floydWarshall"

describe("floydWarshall", () => {

  it("works", () => {

    const gates = {
      a: ['b', 'e'],
      b: ['a', 'd', 'c'],
      c: ['b', 'd'],
      d: ['c', 'b', 'e'],
      e: ['a', 'd'],
    }

    const result = floydWarshall(gates);

    // console.log(result)

    expect(result).to.deep.equal({
      a: { a: 0, b: 1, c: 2, d: 2, e: 1 },
      b: { a: 1, b: 0, c: 1, d: 1, e: 2 },
      c: { a: 2, b: 1, c: 0, d: 1, e: 2 },
      d: { a: 2, b: 1, c: 1, d: 0, e: 1 },
      e: { a: 1, b: 2, c: 2, d: 1, e: 0 },
    })

  })
})