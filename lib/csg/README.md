Constructive Solid Geometry (CSG) is a modeling technique that uses Boolean
operations like union and intersection to combine 3D solids. This library
implements CSG operations on 2D polygons elegantly and concisely using BSP trees,
and is meant to serve as an easily understandable implementation of the
algorithm.

Example usage:

  ```
  const subjectPolygon = fromPolygons([[10, 10], [100, 10], [50, 140]])
  const clipPolygon = fromPolygons([[10, 100], [50, 10], [100, 100]])
  const polygons = subjectPolygon.subtract(clipPolygon).toPolygons()
  ```

## Implementation Details

All CSG operations are implemented in terms of two functions, `clipTo()` and
`invert()`, which remove parts of a BSP tree inside another BSP tree and swap
solid and empty space, respectively. To find the union of `a` and `b`, we
want to remove everything in `a` inside `b` and everything in `b` inside `a`,
then combine polygons from `a` and `b` into one solid:

  ```
  a.clipTo(b)
  b.clipTo(a)
  a.build(b.allPolygons())
  ```

The only tricky part is handling overlapping coplanar polygons in both trees.
The code above keeps both copies, but we need to keep them in one tree and
remove them in the other tree. To remove them from `b` we can clip the
inverse of `b` against `a`. The code for union now looks like this:

  ```
  a.clipTo(b)
  b.clipTo(a)
  b.invert()
  b.clipTo(a)
  b.invert()
  a.build(b.allPolygons())
  ```

Subtraction and intersection naturally follow from set operations. If
union is `A | B`, subtraction is `A - B = ~(~A | B)` and intersection is
`A & B = ~(~A | ~B)` where `~` is the complement operator.

Original code copyright (c) 2011 Evan Wallace (http://madebyevan.com/), under the MIT license
2D version for browsers from https://github.com/come/csg2d.js/
