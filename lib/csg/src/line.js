'use strict';

const Vector = require('./vector');

const EPSILON = 1e-5;

const COLINEAR = 0;
const RIGHT = 1;
const LEFT = 2;
const SPANNING = 3;

/**
 * Represents a convex segment. The vertices used to initialize a segment must
 * be coplanar and form a convex loop. They do not have to be `CSG.Vertex`
 * instances but they must behave similarly (duck typing can be used for
 * customization).
 * Each convex segment has a `shared` property, which is shared between all
 * segments that are clones of each other or were split from the same segment.
 * This can be used to define per-segment properties (such as surface color).
 */
class Segment {
  constructor(vertices, shared) {
    this.vertices = vertices;
    this.shared = shared;
    this.line = fromPoints(vertices[0], vertices[1]);
  }

  clone() {
    const vertices = this.vertices.map(function(v) {
      return v.clone();
    });
    return new Segment(vertices, this.shared);
  }

  flip() {
    this.vertices.reverse().map(function(v) {
      v.negated();
    });
    this.line.flip();
  }
}

class Line {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
    this.normal = new Vector(this.direction.y, -this.direction.x);
  }

  clone() {
    return new Line(this.origin.clone(), this.direction.clone());
  }

  flip() {
    this.direction = this.direction.negated();
    this.normal = this.normal.negated();
  }

  // Split `segment` by this line if needed, then put the segment or segment
  // fragments in the appropriate lists. Colinear segments go into either
  // `colinearRight` or `colinearLeft` depending on their orientation with
  // respect to this line. segments in right or in left of this line go into
  // either `right` or `left`.
  splitSegment(segment, colinearRight, colinearLeft, right, left) {
    // Classify each point as well as the entire polygon into one of the above
    // four classes.
    let segmentType = 0;
    const types = [];
    let t;
    for (let i = 0; i < segment.vertices.length; i++) {
      t = this.normal.dot(segment.vertices[i].minus(this.origin));
      const type = t < -EPSILON ? RIGHT : t > EPSILON ? LEFT : COLINEAR;
      segmentType |= type;
      types.push(type);
    }

    // Put the segment in the correct list, splitting it when necessary.
    switch (segmentType) {
      case COLINEAR:
        if (t != 0) {
          (t > 0 ? colinearRight : colinearLeft).push(segment);
        } else {
          if (segment.line.origin.x < this.origin.x) {
            colinearLeft.push(segment);
          } else {
            colinearRight.push(segment);
          }
        }
        break;
      case RIGHT:
        right.push(segment);
        break;
      case LEFT:
        left.push(segment);
        break;
      case SPANNING: {
        // TODO
        let r = [];
        let l = [];
        let ti = types[0];
        let tj = types[1];
        let vi = segment.vertices[0];
        let vj = segment.vertices[1];

        if (ti == RIGHT && tj == RIGHT) {
          r.push(vi);
          r.push(vj);
        }
        if (ti == LEFT && tj == LEFT) {
          l.push(vi);
          l.push(vj);
        }
        if (ti == RIGHT && tj == LEFT) {
          const t =
            this.normal.dot(this.origin.minus(vi)) /
            this.normal.dot(vj.minus(vi));
          const v = vi.lerp(vj, t);
          r.push(vi);
          r.push(v);
          l.push(v.clone());
          l.push(vj);
        }
        if (ti == LEFT && tj == RIGHT) {
          const t =
            this.normal.dot(this.origin.minus(vi)) /
            this.normal.dot(vj.minus(vi));
          const v = vi.lerp(vj, t);
          l.push(vi);
          l.push(v);
          r.push(v.clone());
          r.push(vj);
        }
        if (r.length >= 2) {
          right.push(new Segment(r, segment.shared));
        }

        if (l.length >= 2) {
          left.push(new Segment(l, segment.shared));
        }
        break;
      }
    }
  }
}

function fromPoints(a, b) {
  const dir = b.minus(a).unit();
  return new Line(a, dir);
}

module.exports = {Segment, Line, fromPoints};
