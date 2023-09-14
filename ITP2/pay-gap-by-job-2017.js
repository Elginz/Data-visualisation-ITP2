function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  //Font sizes
  var fonturl;
  var myCanvas;
  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
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
    textFont(fonturl);

  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
        
        var x = map(propFemale[i],propFemaleMin,propFemaleMax,0 + this.pad,width-this.pad);
        var y = map(payGap[i],payGapMax,payGapMin,0 + this.pad,height - this.pad);
        
        var size = map(numJobs[i],numJobsMin,numJobsMax,this.dotSizeMin,this.dotSizeMax);
        
//creating a colour based on paygap's relativity to the 0 point
    var color_x = map(x,this.pad,width-this.pad,255,0);
    var color_y = map(y,this.pad,height-this.pad,255,0);
        
    fill(color_x,color_y,(color_x+color_y/2))
    stroke(0);
    strokeWeight(1);

      ellipse(x-width/2,y -height/2,size,size);
    }
  };

  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
  line(0,-height/2 + this.pad, 0 ,height/2- this.pad);

    // Add horizontal line.
  line(-width/2 + this.pad, 0, width/2 - this.pad, 0);

  };
}
