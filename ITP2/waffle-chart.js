function WaffleChart() {
    this.name = 'Waffle Chart';
    this.id = 'waffle-chart';
    
    this.weekChart = true;
    
    this.loaded = false;

    this.waffles = [];

    this.button = null;

    //Font sizes
    var fonturl;
    var myCanvas;
    
    //Preload of data, and Fonts
    this.preload = function (){
        var self = this;
        this.data = loadTable(
        './data/waffle/finalData.csv', 'csv','header',
        function(table){
            self.loaded = true;
        });

        fonturl = loadFont(
            "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
            );

        }
    
    this.setup = function() {
        myCanvas = createCanvas(900,576,WEBGL);
        myCanvas.position(350,70);

        //Adding new fonts
        textFont(fonturl);

        //calling and initialising variables
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
        var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate Out', 'Skipped meal', 'Left overs'];
        var spend = ['Less than £30', '£30-49', '£50-69','£69-79','£80 or over'];
        var healthyDiet = ['1','2','3','4','5'];
        var uniStage = ['foundation year', 'Year 1 UG', 'Year 2 UG', 'Year 3 UG', 'Masters','PhD'];
        var gender = ['F', 'M', 'Prefer Not to Say'];
        var age = ['18-21', '22-34','35-49','50-64','65+'];

        //To implement the other variables
        var listName= ["Weekly_spend", "healthy_diet", "uni_stage", "gender", "age"]

        //calling onto initialised variables as shown above
        var lists = [spend, healthyDiet, uniStage, gender, age];
        
        //Create a button that shows graphs when clicked
        var self = this;
        this.button = createButton("Show graphs");
        this.button.position(width/2.5, height/1.5);
        this.button.size(100);
        this.button.mousePressed(function() {
        // Clearing waffles array so users can choose other graphs
        self.waffles = [];

        if (self.weekChart) {
            for (var i = 0; i < days.length; i++) {
                if (i < 4) {
                var w = new Waffle(20 + (i * 220)- width/2, 20- height/2, 200, 200, 10, 10, self.data, days[i], values);
                self.waffles.push(w);
            } else {
                var w = new Waffle(120 + ((i - 4) * 220) - width/2, 240 - height/2, 200, 200, 10, 10, self.data, days[i], values);
                self.waffles.push(w);

                }
            }
            //To produce other graphs 
        } else {
            for (var i = 0; i < lists.length; i++) {
                if (i < 3) {
                    var w = new Waffle(20 + (i * 220) - width/2, 20 - height/2, 200, 200, 10, 10, self.data, listName[i], lists[i]);
                    self.waffles.push(w);
                } else {
                    var w = new Waffle(120 + ((i - 3) * 220) - width/2, 240 - height/2, 200, 200, 10, 10, self.data, listName[i], lists[i]);
                    self.waffles.push(w);
                }
            }

        }
                    self.weekChart = !self.weekChart;
//change button name from "show graphs" to "hide graphs"
            

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        //To change button name when button is clicked
            self.button.html(self.weekChart ? "Weekly meals" : "Other graphs");

    });

        
    };
    
    this.destroy = function (){
    //destroy button when other visualisations are chosen
if (this.button) {
            this.button.remove();
        }
    }
    
    this.draw = function() {
        if (!this.loaded){
            console.log('Data not yet loaded');
            return;
        }
        //drawing of waffles
        background(255);
        for(var i = 0; i<this.waffles.length; i++){
            var w = this.waffles[i];
            w.draw();
        }
        //depict data when mouse nearby
        for(var i = 0; i < this.waffles.length; i++)
            {
                var w = this.waffles[i];
                w.checkMouse(mouseX - width/2,mouseY - height/2);
            }
    }
    
}