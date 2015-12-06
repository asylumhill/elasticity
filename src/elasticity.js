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
    
    this._stopped = false;
    
    this._init = function () { 
      // when window resizes we want to re-evaluate cards
      $(window).bind("resize." + this.id, {
        instance: this
      }, this._layoutBlocks);
            
      // make sure container grows with content
      this.css({overflow: "hidden"});
              
      var e = {target: $(window),
      data: {instance: this}};
      this._layoutBlocks(e);
    }
    
    this.getwidth = function () {
      return this._width;
    };
    
    this.dispose = function() {
      this._clearColumnsKeepBlocks();
      this._clearColumns();
      this.blocks = [];
      this.columns = [];
    };
    
    this._withinStopRange = function(windowWidth) {
      return (windowWidth <= settings.stopWidth);
    }
    
    this._setAndReturnNumberOfColumns = function(windowWidth) {
      this._numberOfColumns = Math.floor((windowWidth - settings.leftOffset) / (settings.blockWidth + settings.triggerOffset));
      return this._numberOfColumns;
    }
    
    this._calculateBoardWidth = function (windowWidth, cols) {
      var boardWidth;
      if(cols <= settings.minColumns) {
        boardWidth = settings.minColumns * settings.blockWidth;
      } else {
        boardWidth = cols * settings.blockWidth;
      }
      return boardWidth;
    };
    
    // this method does two things... first it ensures the width
    // of this control can accomidate the number of columns (avoids wrapping)
    // The other thing it does it let the caller know if new columns were added 
    // or removed by returning a boolean
    this._setBoardWidth = function (windowWidth) {
      var instance = this;
      var cols = this._setAndReturnNumberOfColumns(windowWidth);
      var newBoardWidth = this._calculateBoardWidth.call(this, windowWidth, cols);
      
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
    
    // based on number of columns already established build the column
    // dom elements
    this._buildBoardColumns = function () {
      var instance = this;
      for(var col = 1; col <= this._numberOfColumns; col++) {
        if(!instance.columns[col-1]) {
          var column = $("<div data-column='true' id=\"" + instance.columnsDomIdPrefix + col.toString() + "\"></div>").css({
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
    
    // this method encapsulates the logic to stop the control
    // we are not disposing of the dom elements just stopping
    // control behaivor
    this._setStoppedBlockPositions = function() {
        console.log("Clear Blocks");
        this._clearColumnsKeepBlocks.call(this);
    }
    
    // this method inserts and applies blocks position of block
    // elements to the screen (mostly puts block in correct column)
    this._setBlockPositions = function () {
      var instance = this;
      instance.blocks = 
        (instance.blocks.length == 0) ? this.find("[data-block='true']") : 
        instance.blocks;
      if(!instance.blocks) return false;
      
      var colCount = 0;
      $.each(instance.blocks, function( index, block ) {
        // if we are stopping the control unwrap all the elements
        colCount++;
        var col = instance.columns[colCount-1];
        $( block ).attr( "data-stretched", true );
        $( block ).appendTo(col);
        if(colCount == instance._numberOfColumns) colCount = 0;
      });
      
      return true;
    };
    
    this._stripBehaivor = function() {
      var instance = this;
      for(var i = 0; i <= this.columns.length-1; i++) {
        instance.columns[i].css({
              display: "inherit",
              position: "inherit",
              float: "inherit",
              top: "inherit",
        });
      }
    }
    
    this._clearColumns = function () {
      var instance = this;
      instance.columns = 
        (instance.columns.length == 0) ? this.find("[data-column='true']") : 
        instance.columns;
      
      for(var i = 0; i <= this.columns.length-1; i++) {
        instance.columns[i].remove();
      }
    };
    
    // in this method we take the blocks and add them to the column parent
    // this clears the columns out of any content without losing any dom elements
    this._clearColumnsKeepBlocks = function() {
      var instance = this;
      if(!instance.blocks) return;
      if (!instance.columns[0]) return;
      var parent = instance.columns[0].parent();
      
      for(var i = 0; i <= instance.blocks.length-1; i++) {
        $(instance.blocks[i]).appendTo(parent);
      }
    };
    
    this._clearBlocks = function () {
      var instance = this;
      instance.blocks = 
        (instance.blocks.length == 0) ? this.find("[data-block='true']") : 
        instance.blocks;
        
      for(var i = 0; i <= this.blocks.length-1; i++) {
        instance.blocks[i].remove();
      }
    };
    
    // sometimes we have new blocks that are added and we need
    // to evaluate a restretch without the window being resized
    // if the control is stopped the method will atleast add new items
    // to the base.
    this.forceRestretch = function () {
      var instance = this;
      
      if (!instance.blocks || (instance.blocks.length == 0))
        // add all available blocks
        instance.blocks = this.find("[data-block='true']");
      else {
        // just add new blocks
        var newBlocks = this.find("[data-block='true']:not([data-stretched])");
        $.each(newBlocks, function( index, block ) {
          $( block ).attr( "data-stretched", true );
        });
        Array.prototype.push.apply(this.blocks, newBlocks);
      }
      
      var e = {target: $(window),
      data: {instance: this},
      force: true};
      this._layoutBlocks(e);
    }
    
    // entry point to evaluate positioning of block elements
    this._layoutBlocks = function (e) {
      var windowWidth = $(e.target).width();
      var instance = e.data.instance;
      
      var continueStop = instance._withinStopRange(windowWidth);
      
      if (instance._stopped && continueStop) {
        return;
      }
      else if (!instance._stopped && continueStop) {
        instance._setStoppedBlockPositions.apply(instance);
        instance._stopped = true;
        return;
      }
      
      instance._stopped = false;
      if(!instance._setBoardWidth.call(instance, windowWidth) && !e.force) return;
      instance._buildBoardColumns.apply(instance);
      instance._setBlockPositions.apply(instance);
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