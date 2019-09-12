'use strict';

const {Segment} = require('./line');
const Vector = require('./vector');
const Node = require('./node');

function fromSegments(segments) {
  const csg = new CSG();
  csg.segments = segments;
  return csg;
}

/**
 *
 * @param {array} polygons
 */
function fromPolygons(polygons) {
  const csg = new CSG();
  csg.segments = [];
  for (let i = 0; i < polygons.length; i++) {
    for (let j = 0; j < polygons[i].length; j++) {
      const k = (j + 1) % polygons[i].length;
      csg.segments.push(
        new Segment([new Vector(polygons[i][j]), new Vector(polygons[i][k])])
      );
    }
  }
  return csg;
}

/**
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 */
class CSG {
  constructor() {
    this.segments = [];
  }

  clone() {
    const csg = new CSG();
    csg.segments = this.segments.map(function(p) {
      return p.clone();
    });
    return csg;
  }

  toSegments() {
    return this.segments;
  }

  toPolygons() {
    const segments = this.toSegments();

    let polygons = [];
    let list = segments.slice();

    const findNext = function(extremum) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].vertices[0].squaredLengthTo(extremum) < 1) {
          const result = list[i].clone();
          list.splice(i, 1);
          return result;
        }
      }
      return false;
    };
    let currentIndex = 0;
    while (list.length > 0) {
      polygons[currentIndex] = polygons[currentIndex] || [];
      if (polygons[currentIndex].length == 0) {
        polygons[currentIndex].push(list[0].vertices[0]);
        polygons[currentIndex].push(list[0].vertices[1]);
        list.splice(0, 1);
      }

      const next = findNext(
        polygons[currentIndex][polygons[currentIndex].length - 1]
      );
      if (next) {
        polygons[currentIndex].push(next.vertices[1]);
      } else {
        currentIndex++;
      }
    }

    return polygons;
  }

  /**
   * Return a new CSG solid representing space in either this solid or in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *
   *   A.union(B)
   *
   *   +-------+            +-------+
   *   |       |            |       |
   *   |   A   |            |       |
   *   |    +--+----+   =   |       +----+
   *   +----+--+    |       +----+       |
   *        |   B   |            |       |
   *        |       |            |       |
   *        +-------+            +-------+
   */
  union(csg) {
    const a = new Node(this.clone().segments);
    const b = new Node(csg.clone().segments);
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.build(b.allSegments());
    a.invert();
    return fromSegments(a.allSegments());
  }

  /**
   * Return a new CSG solid representing space in this solid but not in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *
   *   A.subtract(B)
   *
   *   +-------+            +-------+
   *   |       |            |       |
   *   |   A   |            |       |
   *   |    +--+----+   =   |    +--+
   *   +----+--+    |       +----+
   *        |   B   |
   *        |       |
   *        +-------+
   */
  subtract(csg) {
    const b = new Node(this.clone().segments);
    const a = new Node(csg.clone().segments);
    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allSegments());
    a.invert();
    return fromSegments(a.allSegments()).inverse();
  }

  /**
   * Return a new CSG solid representing space both this solid and in the
   * solid `csg`. Neither this solid nor the solid `csg` are modified.
   *
   *   A.intersect(B)
   *
   *   +-------+
   *   |       |
   *   |   A   |
   *   |    +--+----+   =   +--+
   *   +----+--+    |       +--+
   *        |   B   |
   *        |       |
   *        +-------+
   */
  intersect(csg) {
    const a = new Node(this.clone().segments);
    const b = new Node(csg.clone().segments);
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allSegments());
    return fromSegments(a.allSegments());
  }

  /**
   * Return a new CSG solid with solid and empty space switched. This solid is
   * not modified.
   */
  inverse() {
    const csg = this.clone();
    csg.segments.map(function(p) {
      p.flip();
    });
    return csg;
  }
}

module.exports = {fromSegments, fromPolygons, CSG};
