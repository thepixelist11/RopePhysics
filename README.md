# Rope Physics
### Summary:
This is a real-time rope and cloth simulation using the basic Störmer-Verlet method of verlet integration.
This uses the equation: <br>
x<sub>_n_+1</sub> = 2x<sub>_n_</sub> - x<sub>_n_-1</sub> + A(x<sub>_n_</sub>)Δt<sup>2</sup><br>
to calclulate the position (x) of a point in the next timestep based on the last two positions of the points,
the acceleration of the point (A(x<sub>_n_</sub>)) and the delta time (Δt<sup>2</sup>)<br><br>

Verlet integration is a numerical method used to integrate Newton's equations of motion (_wikipedia_).<br><br>

### How to Use:
To use the program, you first need to download the code. Open index.html in a web browser 
(**This was _not_ tested in any browsers other than Google Chrome. There may be some issues or bugs in other browsers.**)
<br>
<br>
**Controls for when in setup mode:**<br>
 \- **LMB**: Place dynamic node or change static node to dynamic<br>
 \- **RMB**: Place static node or change dynamic node to static<br>
 \- **Hold MMB**: Place constraint between two points. If you drag from one point to empty space, a new point will be created at the end<br>
 \- **Hold Spacebar**: Place a line of equidistant nodes<br>
<br>
**Controls for when in simulation mode:**<br>
\- **LMB**: Change static node to dynamic<br>
\- **RMB**: Change dynamic node to static<br>
\- **Hold MMB**:Cut constraints<br>
<br>
**General controls**<br>
\- **Delete**: Clear all nodes and constraints<br>
\- **Hold X or Backspace and press LMB or RMB**: Delete specific node<br>
<br>
<br>
### Credits:
[Wikipedia - Verlet Integration](https://en.wikipedia.org/wiki/Verlet_integration) \- Research and part of description<br>
[Sebastian Lague - YouTube](https://www.youtube.com/@SebastianLague) \- Inspiration
<br>
<br>
### License:

**MIT License**

Copyright 2023 - ThePixelist11

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
