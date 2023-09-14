function SeaLevelnew (){
    //name for the visualisation to appear in menu bar
    this.name = "Sea Level 3D";
    //visualisation id
    this.id = "SeaLevelnew";

    var sphereIndex;
    var selectedMonthIndex;
    var selectedYearIndex;

    //To activate sealevel and others via webGL
    var myCanvas;

    //Initialising
    var numRows, numCols;
    var date = [];
    //gsml refers to  global sea level mean
    var gsml =[];
    var dataMin, dataMax = 0;
    var diagramX, diagramY;
    var tableData;
    var sidebarWidth = 150;
    var buttonHeight = 30;
    //Adding fonts into WEBGL
    var fonturl;

    //initialising text data, and values for dropdown
    var dataText;
    var labelText;
    var mmText;
    var selfY;
    var selfM;

    //preloading of data. function called automatically by gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
         this.table = loadTable(
        './data/seaLevel.csv','csv','header',
            //  callback function to set value
            function(table){
                tableData = table;
                self.loaded = true;
            }
        )
    fonturl = loadFont(
        "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
        );

    }


    this.setup = function(){
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }
        //Adding new fonts for WEBGL
        textFont(fonturl);
//Create a canvas with WEBGL so that the data can be represented in a 3d format
        myCanvas = createCanvas(900,576,WEBGL);
        myCanvas.position(350,70);

        //Setting camera angles by using easyCam
        createEasyCam();
        document.oncontextmenu = () => false;

            //calling onto depict function to add interactive objects
            this.depict();

    } 
    
//function that retrieves data and create interactive objects for user use
this.depict = function() {

        // Getting data for sea level
        numRows = tableData.getRowCount();
        numCols = tableData.getColumnCount();
        //Loading of date and sea level data
        for(var i = 0; i <numRows ; i++)
            {
                date[i] = tableData.getString(i,0);
                gsml[i] = tableData.getNum(i,1);
                
            }
            minMax();

                //DROPDOWN MENUS
    this.sidebarX = width * 1.4;
    //Dropdown menu for years
    selfY = this;      // Store a reference to 'this'
   this.yearDropdown = createSelect();
   this.yearDropdown.position(this.sidebarX,70);
   this.yearDropdown.size(sidebarWidth,buttonHeight);
   this.yearDropdown.option('Select Year');
           for (var i = 0; i< numRows; i++)
           {   //Select year from the dataset
               var year = date[i].split('-')[0];
               this.yearDropdown.option(year,i);
           }
           //change in values when users's choose a value
           this.yearDropdown.changed(function() {
               selectedYearIndex = (selfY.yearDropdown.value() - 11)
               //when user chooses 2015, then the date changes
               if(selectedYearIndex == 254)
               {
                selectedYearIndex = 264;
               }
               console.log("selected year value: " + selectedYearIndex)

           });
                      
   //Dropdown menu for months
    selfM = this; // Store a reference to 'this'
   this.monthDropdown = createSelect();
   this.monthDropdown.position(this.sidebarX,110);
   this.monthDropdown.size(sidebarWidth,buttonHeight);
   this.monthDropdown.option('Select Month');
    for(var i = 0; i < numRows; i++)
    {
        //Select data set for months
        var month = date[i].split('-')[1];
        this.monthDropdown.option(month,i);

    }   
    this.monthDropdown.changed(function() {
        //month.Dropdown value for 0 shows 264 instead, this function makes it go back to 0
        if(selfM.monthDropdown.value() == 264)
        {
            selectedMonthIndex = 0

        }
        //likewise with the value of 1, it shows 265 instead.
        else if (selfM.monthDropdown.value() == 265)
        {
            selectedMonthIndex = 1;
        }
        else //Other values have an additional 252 added to it.
        {
            selectedMonthIndex = selfM.monthDropdown.value() - 252;
        }
        console.log("Selected month Value:", selectedMonthIndex);
    });

//Generate button to generate the final calculation
this.generateButton = createButton("Generate");
this.generateButton.position(this.sidebarX, 150);
this.generateButton.size(sidebarWidth, buttonHeight);
this.generateButton.mousePressed(function(){

    //To calculate the index in seaLevel.csv locate the data
    sphereIndex = selectedYearIndex + selectedMonthIndex;

        console.log("Generated Sphere Index:"+ sphereIndex);
        //Prints put the global sea level average from csv file
        if(sphereIndex < 266)
        {
        //only show the data before 2015 February
        dataText.html(gsml[sphereIndex])
        }
        else{
            //if user chooses data after 2015 February, then it returns NA
            dataText.html("NA");
        }
});
   
   //Draw texts
   labelText = createDiv("Global average Sea Level change: ");
   labelText.style('font-size' ,'20px');
   labelText.position(width * 2.5/5, 30);

   mmText = createP("mm");
   mmText.style('font-size' ,'20px');
   mmText.style('color','#4267B2');
   mmText.position(width - 90, 10);

   //Displays the data that users had picked
   dataText = createP();
   dataText.style('font-size' ,'20px');
   dataText.style('color','#4267B2');
   dataText.position(width - 130, 10);

}

    this.destroy = function(){
        //remove sphereIndex value so it resets the sphere
        sphereIndex = null;

        //remove the menus when user clicks on other visualisation
        this.yearDropdown.remove();
        this.monthDropdown.remove();
        this.generateButton.remove();
        labelText.remove();
        dataText.remove();
        mmText.remove();
            
        }
    
var size = [];

this.draw = function(index) {

        if(!this.loaded)
            {
                console.log('Data not yet loaded');
                return;
            }
    
    // Activates the drawing of the box only when activate is true
        background(220);
        noFill();

        // initialise diagrams
        diagramX = -45;
        diagramY = 10;
        let radius = 10;
        let ang = 360 /numRows;

        //Drawing of data sets based on 2D sea level.
        for (var i = 0; i < numRows; i ++){
            stroke('blue');
            strokeWeight(0.5);    
            size[i] = map(gsml[i], -3.5,79.5,0,205);
            let pointx = (size[i] + radius)*cos(radians(ang*i)) + diagramX;
            let pointz = (size[i] + radius)*sin(radians(ang*i)) + diagramY;
            //implementation of 3D y coordinates based on dataset
            let pointy = gsml[i] * -2.5 + 100;
            push();
            translate(pointx,pointy, pointz);
            if(sphereIndex == i )
            {
                //Make sphere red and bigger for user to see when selected
                stroke('red');
                sphere(3.2)
            }
            else{
                //Else, draw normal sphere
                sphere(1.2);
            }
            pop();
    
        }
        //Draw box to encase diagram
        stroke('black')
        let boxSize = 365;
        box(boxSize);    

    }

    //Iterate over data and determine max and min values present for scalling of data points
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