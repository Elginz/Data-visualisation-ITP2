function TechDiversityRace() {
    
    //EXPERIMENTATION
    var startTime;    
    
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race (Improved)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;

    //Font sizes
    var fonturl;
    var myCanvas;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv', 'csv', 'header',
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
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    myCanvas = createCanvas(900,576,WEBGL);
    myCanvas.position(350,70);
    textFont(fonturl);

      //initialising the starting time
      startTime = millis();
         
    // Create a select DOM element.
     this.select = createSelect();

    // Set select position.
     this.select.position(width/2,200);
    
    // Fill the options with all company names.
      var companies = this.data.columns;
      var state = false;
      for (var i =0; i < companies.length;i++)
          {
              if(companies[i] != "")
              {
                if(state == false){
                    this.select.selected(companies[i]);
                    state = true;
                } 
                else 
                {
                    this.select.option(companies[i]);
                }
              }
          }
  };

    this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(0, 0, width * 0.4);


  this.draw = function() {
    if (!this.loaded)
    {
      console.log('Data not yet loaded');
      return;
    }
      
    // Get the value of the company we're interested in from the
    // select item.
    // Use a temporary hard-code example for now.
    var companyName = this.select.value(); //dont erase
      
    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

      
    //calculating the interpolation of the times by subtracting the initial start time
    var currentTime = millis() - startTime;
    
    var duration = 800;
    //change the time of interpolations
    var t = map(currentTime, 0, duration, 0,1);
    t = constrain(t,0,1);

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title,t);


  };

}
//reference for animation: https://p5js.org/reference/#/p5/millis
//https://p5js.org/reference/#/p5/constrain
