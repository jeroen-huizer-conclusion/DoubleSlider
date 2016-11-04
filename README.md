# RangeSlider

Provides a range slider using jQuery UI. 

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Use this when you need a slider with one or two handles. 
To select a value in a range or when you want to define a range with two values.
 
## Configuration

1. Select an attribute for the left handle.
2. Select an attribute for the right handle, if empty no handle is created.
3. Select attributes for the min and max values on the slider.
4. Select an attribute that defines the step size when dragging a handle; optional, defaults to 1% of the selectable range.
	N.B.: Do not choose too small a value for the step size, as the widget will not handle clicks correctly anymore.


## Dependencies

1. jQuery v3.1.1
2. jQuery UI (custom build)
