'use strict';

/**
 * Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
 * by picking a polygon to split along. That polygon (and all other coplanar
 * polygons) are added directly to that node and the other polygons are added to
 * the right and/or left subtrees. This is not a leafy BSP tree since there is
 * no distinction between internal and leaf nodes.
 */
class Node {
  constructor(segments) {
    this.line = null;
    this.right = null;
    this.left = null;
    this.segments = [];
    if (segments) {
      this.build(segments);
    }
  }

  clone() {
    const node = new Node();
    node.line = this.line && this.line.clone();
    node.right = this.right && this.right.clone();
    node.left = this.left && this.left.clone();
    node.segments = this.segments.map(function(p) {
      return p.clone();
    });
    return node;
  }

  // convert solid space to empty space and empty space to solid space.
  invert() {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].flip();
    }
    this.line.flip();
    if (this.right) this.right.invert();
    if (this.left) this.left.invert();
    const temp = this.right;
    this.right = this.left;
    this.left = temp;
  }

  // recursively remove all segments in `segments` that are inside this BSP tree
  clipSegments(segments) {
    if (!this.line) {
      return segments.slice();
    }

    let right = [];
    let left = [];

    for (let i = 0; i < segments.length; i++) {
      this.line.splitSegment(segments[i], right, left, right, left);
    }

    if (this.right) {
      right = this.right.clipSegments(right);
    }

    if (this.left) {
      left = this.left.clipSegments(left);
    } else {
      left = [];
    }

    return right.concat(left);
  }

  // remove all segments in this BSP tree that are inside the other BSP tree `bsp`
  clipTo(bsp) {
    this.segments = bsp.clipSegments(this.segments);
    if (this.right) {
      this.right.clipTo(bsp);
    }

    if (this.left) {
      this.left.clipTo(bsp);
    }
  }

  // return a list of all segments in this BSP tree
  allSegments() {
    let segments = this.segments.slice();

    if (this.right) {
      segments = segments.concat(this.right.allSegments());
    }

    if (this.left) {
      segments = segments.concat(this.left.allSegments());
    }

    return segments;
  }

  /**
   * Build a BSP tree out of `segments`. When called on an existing tree, the
   * new segments are filtered down to the bottom of the tree and become new
   * nodes there. Each set of segments is partitioned using the first polygon
   * (no heuristic is used to pick a good split).
   */
  build(segments) {
    if (!segments.length) {
      return;
    }

    if (!this.line) {
      this.line = segments[0].line.clone();
    }

    let right = [];
    let left = [];

    for (let i = 0; i < segments.length; i++) {
      this.line.splitSegment(
        segments[i],
        this.segments,
        this.segments,
        right,
        left
      );
    }

    if (right.length) {
      if (!this.right) {
        this.right = new Node();
      }

      this.right.build(right);
    }
    if (left.length) {
      if (!this.left) {
        this.left = new Node();
      }

      this.left.build(left);
    }
  }
}

module.exports = Node;
