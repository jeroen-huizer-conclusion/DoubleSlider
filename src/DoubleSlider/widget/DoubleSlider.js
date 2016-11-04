/*
    DoubleSlider
    ========================

    @file      : DoubleSlider.js
    @version   : 1.0
    @author    : Jeroen Huizer
    @date      : 
    @copyright : 
    @license   : Apache v2

    Documentation
    ========================
    Wraps the slider widget of jQueryUI.
*/

// Required module list.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/lang",
    "DoubleSlider/widget/lib/jquery-3.1.1",
    "DoubleSlider/widget/lib/jquery-ui-slider",
    "dojo/text!DoubleSlider/widget/template/DoubleSlider.html"
], function (declare, _WidgetBase, _TemplatedMixin, lang, /**/_jQuery, _jQueryUI, widgetTemplate){

    "use strict";

	var $ = _jQuery.noConflict(true); 

    // Declare widget's prototype.
    return declare("DoubleSlider.widget.DoubleSlider", [_WidgetBase, _TemplatedMixin], {
        
		// _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements

        // Parameters configured in the Modeler.
        fromValueAttr: "",
        toValueAttr: "",
        minAttr: "",
        maxAttr: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
		_slider: null,
		
		_minValue: 0,
		_maxValue: 100,
		_fromValue: 25,
		_toValue: null,
		_rangeStep: 10,
		
        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            //console.log(this.id + ".postCreate");
			this._updateRendering();
        },

        update: function (obj, callback) {
            //console.log(this.id + ".update");

            this._contextObj = obj;
			
			this._resetSubscriptions();
			this._updateSettings();
			this._updateRendering();
			
            callback();
        },
		
		/* Update the settings */
		_updateSettings: function(){
			this._fromValue = this._toFloat(this._contextObj, this.fromValueAttr, this._fromValue);
			this._toValue = this._toFloat(this._contextObj, this.toValueAttr, this._toValue);
			
			this._minValue = this._toFloat(this._contextObj, this.minAttr, this._minValue);
			this._maxValue = this._toFloat(this._contextObj, this.maxAttr, this._maxValue);
			
			this._rangeStep = this._toFloat(this._contextObj, this.stepAttr, (this._maxValue - this._minValue)/100);
		},
		
		/* Rerender the interface. */
        _updateRendering: function () {
							
			var options = {};
			if(!this.toValueAttr){
				options.range = "min";
				options.value = this._fromValue
			}
			else{
				options.range = true;
				options.values = [this._fromValue, this._toValue];
			}
			options.min = this._minValue;
			options.max = this._maxValue;
			options.step = this._rangeStep;
			options.orientation = this.orientation;
			options.stop = lang.hitch(this, this._slideStop)
						
			if(this._slider){
				this._slider.slider("destroy");
			}
			this._slider = $(this.domNode).slider(options);				
		},
		
		/* Reset subscriptions on the contextobj */
		_resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            var objHandle = null;

            // Release handles on previous object, if any.
            if (this._handles) {
				for(var iHandle in this._handles){
                    mx.data.unsubscribe(this._handles[iHandle]);
				}
            }

            if (this._contextObj) {
                objHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: function(guid){this._updateSettings(); this._updateRendering();}
                });

                this._handles = [objHandle];
            }
        },
		
		/* get attr of obj and parse to float. Return fallback if NaN*/
		_toFloat(obj, attr, fallback){
			
			var parsed = parseFloat(obj.get(attr));
			if(!isNaN(parsed))
				return parsed;
			return fallback;
		},
		
		/* function to execute on slide stop */
		_slideStop(event, ui){
			
			if(ui.handleIndex == 0){
				this._contextObj.set(this.fromValueAttr, ui.value);
			}else if(ui.handleIndex == 1){
				this._contextObj.set(this.toValueAttr, ui.value);
			}
			
			mx.data.commit({
				mxobj: this._contextObj,
				callback: function() {},
				onValidation: function(v) {console.log("Validation: " + v);},
				error: function(e) {console.log("Error while committing object: " + e);}
			});
		}
	});
	

});

require(["DoubleSlider/widget/DoubleSlider"], function () {
    "use strict";
});