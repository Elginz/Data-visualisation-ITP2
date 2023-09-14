function NutrientsTimeSeries(){
    //Name for the visualisation to appear in the menu bar
    this.name = 'Nutrients: 1974-2016';
    
    //Each visualisation must have a unique ID with no special character 
    this.id = 'nutrients-timeseries';
    
    //Title to display above the plot
    this.title = 'Nutrients: 1974-2016';
    
    //Names for each axis.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '%';
    
    this.colors =[];
    var marginSize = 35;
    //Font sizes
    var fonturl;
    var myCanvas;
    
    //Layout object to store all common plot layout parameters and methids
    this.layout = {
        marginSize: marginSize,

        leftMargin: -width/2 + 100,
        rightMargin: width/2 - marginSize -30,
        topMargin: -height/2+ marginSize,
        bottomMargin: height/2 - marginSize * 2,
        pad: 5,
        
        plotWidth: function() {
            return this.rightMargin - this.leftMargin; 
        },

        plotHeight: function() {
            return this.bottomMargin - this.topMargin;
        },
        
        grid: true,
        
        numXTickLabels: 10,
        numYTickLabels: 8,    
        
    };
    
    //helper functions
        this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center','center');
        
        text(this.title, (this.layout.plotWidth() /2) + this.layout.leftMargin, this.layout.topMargin- (this.layout.marginSize /2));
    };
        
    this.mapYearToWidth = function(value){
        return map(value,
            this.startYear,
            this.endYear,
            this.layout.leftMargin,
            this.layout.rightMargin);
        };
    
    this.mapNutrientsToHeight = function(value){
        return map(value,
                    this.minPercentage,
                    this.maxPercentage,
                    this.layout.bottomMargin,
                    this.layout.topMargin);
        };
    this.mapMouseXToYear = function(value) {
        return int(map(value,
                      this.layout.leftMargin,
                      this.layout.rightMargin,
                      this.startYear,
                      this.endYear));
            }
    
    this.makeLegendItem = function(label,i,colour){
        var boxWidth = 50;
        var boxHeight = 10;
        var x = width/4;
        var y = -height/2.5 + (boxHeight +2) * i;
        noStroke();
        fill(colour);
        rect(x,y,boxWidth,boxHeight);
        fill('black');
        noStroke();
        textAlign('left','center');
        textSize(12);
        text(label,x + boxWidth + 10, y+boxHeight/2);
        
    }
    
    //property to represent whether data has been loaded.
    this.loaded = false;
    
    //preload the data. The function is called automatically by the gallery when a visualisation is added.
    
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/food/nutrients74-16.csv','csv','header',
            //function callback to set the value
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
        //font defaults.
        textFont(fonturl);
        textSize(16);
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length -1]);
        
        for (var i =0; i< this.data.getRowCount(); i++)
            {
                this.colors.push(color(random(0,255),random(0,255),random(0,255)));
            }
        
        this.minPercentage  = 80;
        this.maxPercentage = 400;
        
        };

    this.destroy = function() {
    };

    this.draw = function() {
        if(!this.loaded){
            console.log('Data not yet loaded');
            return;
        }
        this.drawTitle();
        
        drawYAxisTickLabels(this.minPercentage,
                           this.maxPercentage,
                           this.layout,
                           this.mapNutrientsToHeight.bind(this),
                           0);
        drawAxis(this.layout);
        
        drawAxisLabels(this.xAxisLabel,
                       this.yAxisLabel,
                       this.layout);
        //plot all pay gaps between startYear and endYear using the width of the canvas minus margins.
        
        var numYears= this.endYear - this.startYear;
        //loop over all rows and draw a line from the previous value to the current
        
        for (var i =0; i < this.data.getRowCount(); i++)
            {
                var row = this.data.getRow(i);
                var previous = null; 
                var title = row.getString(0);
                
                for(var j = 1; j < numYears; j++)
                    {
                        var current ={
                            'year': this.startYear + j - 1,
                            'percentage': row.getNum(j)              
                        };
                        
                    if(previous !=null){
                        stroke(this.colors[i]);
                        line(this.mapYearToWidth(previous.year),
                             this.mapNutrientsToHeight(previous.percentage),
                             this.mapYearToWidth(current.year),
                             this.mapNutrientsToHeight(current.percentage));
                        
                        var xLabelSkip = ceil(numYears/this.layout.numXTickLabels);
                        
                        if(i % xLabelSkip ==0)
                            {
                                var currentTextSize = textSize();
                                textSize(9);
                                
                                drawXAxisTickLabel(previous.year, this.layout,this.mapYearToWidth.bind(this));
                                textSize(currentTextSize);
                            }
                        }
                        else 
                        {
                            noStroke();
                            
                            this.makeLegendItem(title,i,this.colors[i]);
                            
                            fill(this.colors[i]);
                            text(title,width/2 - 50,this.mapNutrientsToHeight(current.percentage));
                        }
                        previous= current;
                    };
            };
        
        this.drawYearBesidesMouse();
    };
    this.drawYearBesidesMouse = function() {
        var year = this.mapMouseXToYear(mouseX- width/2);
        fill(0);
        noStroke();
        text(year,mouseX - width/2 + 20,mouseY - width/3 + 30);
    }
    
}