/*!
* Elasticity Responsive View Control v1.0 (jQuery Plugin)
* (c) Asylum Hill Software, LLC
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

(function ($) {
  'use strict';
    
  $.fn.elasticity = function (options) {
    this.name = "ElasticityControlV1";
    this.columnsDomIdPrefix = "smartLayoutElasticityColumn";
    this.blocks = [];
    this.columns = [];
    
    this._firstStopWidth = true;
    
    this._init = function () { 
      // when window resizes we want to re-evaluate cards
      $(window).bind("resize." + this.id, {
        instance: this
      }, this._layoutCards);
            
      // make sure container grows with content
      this.css({overflow: "hidden"});
              
      var e = {target: $(window),
      data: {instance: this}};
      this._layoutCards(e);
    }
    
    this.getwidth = function () {
      return this._width;
    };
    
    this._calculateBoardWidth = function (windowWidth) {
      var boardWidth;
      this._numberOfColumns = Math.floor((windowWidth - settings.leftOffset) / (settings.blockWidth + settings.triggerOffset));
      if(this._numberOfColumns <= settings.minColumns) {
        boardWidth = settings.minColumns * settings.blockWidth;
      } else {
        boardWidth = this._numberOfColumns * settings.blockWidth;
      }
      return boardWidth;
    };
        
    this._setBoardWidth = function (windowWidth) {
      var instance = this;
      var newBoardWidth = this._calculateBoardWidth.call(this, windowWidth);
      
      // evaluate if we should stop setting the width for anything
      if(newBoardWidth == this._width) {
        return false;
      }
      
      instance._width = newBoardWidth;
      $.each(settings.linkWithDomIds, function( index, value ) {
        $('#' + value).css("width", instance._width.toString() + "px");
      });
  
      return true;
    };
        
    this._buildBoardColumns = function () {
      var instance = this;
      for(var col = 1; col <= this._numberOfColumns; col++) {
        if(!instance.columns[col-1]) {
          var column = $("<div id=\"" + instance.columnsDomIdPrefix + col.toString() + "\"></div>").css({
              display: "inline-block",
              position: "relative",
              float: "left",
              top: "0px",
          });
          this.append(column);
          instance.columns.push(column);
        }
      }
    };
        
    this._setCardPositions = function () {
      var instance = this;
      instance.blocks = 
        (instance.blocks.length == 0) ? this.find("[data-block='true']") : 
        instance.blocks;
      if(!instance.blocks) return;
      
      var colCount = 0;
      instance.blocks.each(function(index, element){
          colCount++;
          var col = instance.columns[colCount-1];
          $( this ).appendTo(col);
          if(colCount == instance._numberOfColumns) colCount = 0;
      });
    };
        
    this.clear = function () {
      var instance = this;
      instance.blocks = 
        (instance.blocks.length == 0) ? this.find("[data-block='true']") : 
        instance.blocks;
        
      instance.blocks.each(function (index) {
          $(this).remove();
      });
    };
    
    this.forceRestretch = function () {
      var e = {target: $(window),
      data: {instance: this},
      force: true};
      this._layoutCards(e);
    }
    
    this._layoutCards = function (e) {
      var windowWidth = $(e.target).width();
      var instance = e.data.instance;
      
      // evaluate if we should stop elastic rending because of a width threshold
      if(windowWidth <= settings.stopWidth && instance._firstStopWidth == false) return;
      else if(windowWidth <= settings.stopWidth)
        instance._firstStopWidth = false;
      else
        instance._firstStopWidth = true;
        
      if(!instance._setBoardWidth.call(instance, windowWidth) && !e.force) return;
      instance._buildBoardColumns.apply(instance);
      instance._setCardPositions.apply(instance);
    };
    
    // set default options
    var settings = $.extend({
        blockWidth: 0,
        leftOffset: 0,
        triggerOffset: 0,
        stopWidth: 0,
        minColumns: 0,
        linkWithDomIds: []
    }, options );
    
    // wire up control
    this._init();
  
    // set default style
    return this.css({
        blockWidth: 385,
        leftOffset: 0,
        triggerOffset: 0,
        stopWidth: 767,
        minColumns: 1,
        linkWithDomIds: []
    });
 
  };
 
}( jQuery ));