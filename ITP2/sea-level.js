function SeaLevel (){
        
    //name for the visualisation to appear in menu bar
    this.name = "Sea Level";
    //visualisation id
    this.id = "SeaLevel";
    
    // initialise axis
    this.currentCirX;
    this.currentCirY;
    
    //property to represent whether data has been loaded
    this.loaded = false;
    //loading of fonts
    var fonturl;
    var myCanvas;

    //initialising to draw data
    var numRows, numCols;
    var date = [];
    //gsml: global sea level mean
    var gsml =[];
    var dataMin, dataMax = 0;
    var diagramX, diagramY;
    var tableData;
    
    // Creating an animation state and declaring it false
        var animationComplete = false;
        var currentSizes = [];
    
    //preloading of data. function called automatically by gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
         this.data = loadTable(
        './data/seaLevel.csv','csv','header',
             //callback function to set value
            function(table){
                tableData = table;
                self.loaded = true;
                self.setup();                
            }
        );

        fonturl = loadFont(
            "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
            );
    
    }
            
    
    this.setup = function(){
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //Adding canvas to ensure that it remains in 2D position
    myCanvas = createCanvas(900,576,WEBGL);
    myCanvas.position(350,70);
    //Adding new fonts for WebGL
    textFont(fonturl);

    //Getting data from csv file
    numRows = tableData.getRowCount();
    numCols = tableData.getColumnCount();
    
        
        //loading of date and sea level data
    for(var i = 0; i <numRows ; i++)
        {
            date[i] = tableData.getString(i,0);
            gsml[i] = tableData.getNum(i,1);
            
        }
    minMax();
        
        //To store current size of each data point to gradually update size of points
        currentSizes = Array(numRows).fill(0);        
    };
    
    this.destroy = function(){
    };
    
    
    this.draw = function() {
        
        if(!this.loaded)
            {
                console.log('Data not yet loaded');
                return;
            }
        
//Creating animation and its logic
    if (!animationComplete) {
      var targetSizes = gsml;
      var animationSpeed = 0.05;
      var threshold = 0.1;
      
        //smooth transitioning data points from initial size to the target sizes
      for (var i = 0; i < numRows; i++) {
        var diff = targetSizes[i] - currentSizes[i];
        currentSizes[i] += diff * animationSpeed;
        
        if (abs(diff) < threshold) {
          currentSizes[i] = targetSizes[i];
        }
      }
      
    }
// End of animation         
 // reference for animation 
// https://editor.p5js.org/codingJM/sketches/kKhO-GWex

        
    //Declaring and initialising variables 
        diagramX = 0;
        diagramY = 0;
        var radius = width/6;
        var ang = 360/numRows;
        
        
    for(var i =0; i< numRows; i++)
        {               
            //Calculate the current size based on the animation progress
    var currentSize = map(currentSizes[i], dataMin, dataMax, 0, radius);
    // Calculate the current position of the line
    var currentPointX = (currentSize + radius) * cos(radians(ang * i));
    var currentPointY = (currentSize + radius) * sin(radians(ang * i));
    this.currentCirX = radius * cos(radians(ang * i)) + diagramX;
    this.currentCirY = radius * sin(radians(ang * i)) + diagramY;


            //draw the lines connecting the dots to the circle
            stroke('black');
            strokeWeight(0.2);
            line(this.currentCirX, this.currentCirY, currentPointX, currentPointY);


            //Sea level title, placed in the center
            textAlign(CENTER);
            textSize(14);
            fill('black');
            text("Global Average Sea Level Change", diagramX,diagramY -45);

            //Shortest distance between mouse position to line and declare it as dis
            var distance = distToSegment(
            {x:mouseX - width/2, y: mouseY - height/2},
            {x:this.currentCirX, y: this.currentCirY},
            {x:currentPointX, y: currentPointY}
            );
            var dis = dist(mouseX - width/2, mouseY - height/2, currentPointX,currentPointY);

            
            //Display information when mouse is near a line or a point using dis
            if(dis < 4 || distance <2){
                fill('red');
                datasize = 10;
                textAlign(CENTER);
                textSize(15);
                fill('black');
                text("Date: " +date[i],diagramX,diagramY);
                textSize(25);
            fill(66,103,178);
                text(gsml[i] + " mm",diagramX, diagramY +45);
            }else
                {
            fill(66,103,178);
                    datasize =3;
                }

            //draw data points
            fill(66,103,178);
            noStroke();
            ellipse(currentPointX,currentPointY,4);
            
            }

}
    
    //Iterate over data and determines max and min values present for scalling of data points
    function minMax() {

    for(var i =0; i<numRows; i++)
        {
        if(tableData.getNum(i,1) > dataMax)
            {
                dataMax = tableData.getNum(i,1);
            }
        }

    dataMin = dataMax;
    for(var i =0; i < numRows; i++)
        {
            if(tableData.getNum(i,1) < dataMin)
                {
                    dataMin = tableData.getNum(i,1);
                }
        }
    }
}

    
// functions to measure the shortest distance between line and mouse point. It utilises the closest distance from a point
    function sqr(x) {
        return x*x;
    }
    
  function dist2(v, w) {
    return sqr(v.x - w.x) + sqr(v.y - w.y);
    }

  function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    }

  function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
    }


//reference to determine closest point distance: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

//Sea level code adapted from:  https://www.youtube.com/watch?v=u-RiEAQsXlw&t=1189s