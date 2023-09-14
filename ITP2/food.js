function Food() {
    //Name for the visualisation to appear
    this.name ='Food';
    
    //Each Visualisation must have a unique ID with no special characters
    this.id = 'food';
    
    //property to represent whether data has been loaded
    this.loaded = false;
    
    var bubbles = [];
    var maxAmt;
    var years = [];
    var yearButtons = [];
    //Font sizes
    var fonturl;
    var myCanvas;
    
  //Preload data. Function called automatically by the gallery whena visualisation is added, along with fonts
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/food/foodData.csv','csv','header',
            //callback function to set value
            function(table){
                self.loaded = true;
            });

        fonturl = loadFont(
            "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
            );
    
    }
    
    //called automatically when user clicks on the menu button
    this.setup = function () {
        this.data_setup(); 
        //Adding canvas to ensure that it remains in 2D position
        myCanvas = createCanvas(900,576,WEBGL);
        myCanvas.position(350,70);
        //Adding new fonts
        textFont(fonturl);
    };
    
    //called automatically when the user clicks on other menu buttons
    this.destroy = function() {
        this.select.remove();
    }
    
    this.draw = function() {
        if(!this.loaded){
            console,log('Data not yet loaded');
            return;
        }
        
        // Draw legends for bubbles
        for (var i =0; i < bubbles.length; i++)
            {
            fill(bubbles[i].color);
            rect(-width/2,-height/2.4 + 20 *i ,40,15);
            fill(0);
            textSize(9);
            strokeWeight(0);
            textAlign(LEFT);
            //variable names
            text(bubbles[i].name,-width/2.2,-height/2.5 + 20*i);
            strokeWeight(1);     
            }
        translate(width/1.7, height/2);
    
        //Draw bubbles
        for(var i =0; i<bubbles.length; i++)
            {
                bubbles[i].update(bubbles);
                bubbles[i].draw();
            }
        
    }
    
    this.data_setup = function() {
        //initialising variables 
        bubbles = [];
        maxAmt;
        years = [];
        yearButtons = [];
        
        var rows = this.data.getRows();
        var numColumns = this.data.getColumnCount();
        
        //creates bubble for each food type 
        //each bubble consists of data value from various years
        maxAmt =0;
        for(var i =0; i < rows.length;i++)
            {
                if(rows[i].get(0) != "")
                    {               //sets the food name 
                        var b = new Bubble(rows[i].get(0));
                        
                        for(var j =5; j < numColumns; j++)
                            {//gets the value for each year
                                if(rows[i].get(j) != "")
                                {
                                    var n = rows[i].getNum(j);
                                    if(n > maxAmt)
                                        {
                                            maxAmt =n; //tally of the highest value
                                        }
                                    b.data.push(n);//push data in 
                                }
                                else
                                {   //for empty values
                                    b.data.push(0);
                                }
                            }
                        bubbles.push(b);
                    }
            }
        for(var i =0; i < bubbles.length; i++)
            {
                bubbles[i].setMaxAmt(maxAmt);
                bubbles[i].setData(0); //set to the first data
            }
        
    // Dropdown menu         
     this.select = createSelect();
    // Set select position.
     this.select.position(width/2.5,height*0.08);
    // Fill the options with all years.
      var options = this.data.columns;
      var state = false;
      for (var i =4; i < options.length;i++)
          {
              if(options[i] != "")
              {
                if(state == false){
                    this.select.selected(options[i]);
                    state = true;

                } 
                else 
                {
                    this.select.option(options[i]);

                }
              }
          }

    
        //To change the bubble value based on the years chosen 
    this.select.changed(function() {
                var selectedYear = this.value();
                changeYear(selectedYear, options, bubbles);
            });
    };

    function changeYear(year,_years,_bubbles) {
        var y = _years.indexOf(year);
        //set the selected year for all the bubbles
        for(var i = 0; i < _bubbles.length; i++)
            {
                _bubbles[i].setData(y);
            }
    }
}