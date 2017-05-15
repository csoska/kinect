import numpy as np
import math

positions = []
uv = []
faces = []

offsets = [
    np.array([-1.0, 1.0, 0.0]),
    np.array([1.0, 1.0, 0.0]),
    np.array([1.0, -1.0, 0.0]),
    np.array([-1.0, -1.0, 0.0])
]

resolution_x =  512
resolution_y = 424
pointsize_x = 1.0 / (float(resolution_x) -1.0)
pointsize_y = 1.0 / (float(resolution_y) - 1.0)
pointsize = np.array([pointsize_x, pointsize_y, 1.0])
uv = []
vidx = 1

for (v,y) in zip(np.linspace(0.0, 1.0, resolution_y), np.linspace(-1.0, 1.0, resolution_y)):
    for (u,x) in zip(np.linspace(0.0, 1.0, resolution_x), np.linspace(-1.0, 1.0, resolution_x)):
        center = np.array([x, y, 0.0])
        for offset in offsets:
            p = center + (offset * pointsize)
            positions.append("v {} {} {}\n".format(p[0], p[1], p[2]))
            uv.append("vt {} {}\n".format(u, v))
        faces.append("f {0}/{0} {1}/{1} {2}/{2}\n".format(vidx+0, vidx+1, vidx+2))
        faces.append("f {0}/{0} {1}/{1} {2}/{2}\n".format(vidx+2, vidx+3, vidx+0))
        vidx += 4
print("n faces: {}".format(len(faces)))
with open("kinect/examples/images/mesh.obj", "wt") as dest: 
    dest.write("".join(positions))
    dest.write("".join(uv))
    dest.write("".join(faces))