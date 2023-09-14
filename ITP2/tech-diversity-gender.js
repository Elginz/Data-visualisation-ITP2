function TechDiversityGender() {
    
    //EXPERIMENT
  var startTime;

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Gender (Improved)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-gender';

  //Font sizes
  var fonturl;
  var myCanvas;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.

    leftMargin: -width/2 + 155,
    rightMargin: width/2 - 85,
    topMargin: -height/2 + 20,
    bottomMargin: height/2,
    pad: 5,


    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Middle of the plot: for 50% line.
  this.midX = (this.layout.plotWidth() / 2) + this.layout.leftMargin;

  // Default visualisation colours.
  this.femaleColour = color(255, 0 ,0);
  this.maleColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/gender-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

    fonturl = loadFont(
      "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
      );
  

  };

  this.setup = function() {
    myCanvas = createCanvas(900,576,WEBGL);
    myCanvas.position(350,70);
    // Font defaults.
    textSize(10);
    textFont(fonturl);
    startTime = millis();
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
        
    }

            
      
    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight = (height - this.layout.topMargin * 0.1) /
        this.data.getRowCount();

    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Calculate the y position for each company.
      var lineY = (lineHeight * i) + this.layout.topMargin;

      // Create an object that stores data from the current row.
      var company = {
        // Convert strings to numbers.
         'name': this.data.getString(i,"company"),
         'female': this.data.getNum(i,"female"),
         'male': this.data.getNum(i,"male")
      };

      // Draw the company name in the left margin.
      fill(0);
      noStroke();
      textAlign('right', 'top');
      text(company.name,
           this.layout.leftMargin - this.layout.pad,
           lineY);
        
//Start of animation
    
var currentTime = millis() - startTime;
var maleInterpolation = map(currentTime,0,1000,0,1);
var femaleInterpolation = map(currentTime,0,1000,0,1);
        
// Draw female employees rectangle. 
                
        
fill(this.femaleColour);
var femaleWidth = this.mapPercentToWidth(company.female) * femaleInterpolation;
        if (femaleWidth > this.mapPercentToWidth(company.female))
        {
            femaleWidth = this.mapPercentToWidth(company.female);
        }
        rect(
        this.layout.leftMargin,
        lineY,
        femaleWidth,
        lineHeight - this.layout.pad);
        
        
  // Draw male employees rectangle.
    fill(this.maleColour);
    var maleWidth = this.mapPercentToWidth(company.male) * maleInterpolation; 
    var maleStart = this.layout.rightMargin -maleWidth;
        

      // Check if the male rectangle has reached or exceeded the female rectangle.
      if (maleStart <= this.layout.leftMargin + femaleWidth) {
        // Adjust the male rectangle's width to match the female rectangle.
        maleWidth = this.layout.rightMargin - (this.layout.leftMargin + femaleWidth);
        maleStart = this.layout.rightMargin - maleWidth;
          
      }
      rect(
        maleStart,
        lineY,
        maleWidth,
        lineHeight - this.layout.pad
      );
        
        
    }
// End of animation
      
    // Draw 50% line
    stroke(150);
    strokeWeight(1);
    line(this.midX,
         this.layout.topMargin,
         this.midX,
         this.layout.bottomMargin);

  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('left', 'top');
    text('Female',
         this.layout.leftMargin,
         this.layout.pad - height/2);
    textAlign('center', 'top');
    text('50%',
         this.midX,
         this.layout.pad - height/2);
    textAlign('right', 'top');
    text('Male',
         this.layout.rightMargin,
         this.layout.pad - height/2);
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent,
               0,
               100,
               0,
               this.layout.plotWidth());
  };
}

//reference for animation: https://p5js.org/reference/#/p5/millis
//https://p5js.org/reference/#/p5/constrain
