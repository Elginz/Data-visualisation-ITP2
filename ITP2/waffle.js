function Waffle(x,y,width,height,boxes_across, boxes_down, table, columnHeading, possibleValues){

    var x = x;
    var y = y;
    var height = height;
    var width = width;
    var boxes_down = boxes_down;
    var boxes_across = boxes_across;

    var column = table.getColumn(columnHeading);
    var possibleValues = possibleValues;

    var colours = ["red","green","blue","purple","yellow","orange"];

    var categories = [];
    var boxes = [];

    //list of names for legend
    var listName= ["Weekly spending", "Healthy Diet", "University stage", "Gender", "Age"];

    
    var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate Out', 'Skipped meal', 'Left overs'];
    var spend = ['Less than £30', '£30-49', '£50-69','£69-79','£80 or over'];
    var healthyDiet = ['1','2','3','4','5'];
    var uniStage = ['foundation year', 'Year 1 UG', 'Year 2 UG', 'Year 3 UG', 'Masters','PhD'];
    var gender = ['F', 'M', 'Prefer Not to Say'];
    var age = ['18-21', '22-34','35-49','50-64','65+'];
    var lists = [spend, healthyDiet,uniStage,gender, age];

    function categoryLocation(categoryName){
        for(var i=0;i<categories.length;i++){
            if(categoryName==categories[i].name){
                return i;
            }
        }
        return -1;
    }

    function addCategories(){
        for(var i=0;i<possibleValues.length;i++){
            categories.push({
                "name":possibleValues[i],
                "count":0,
                "colour":colours[i%colours.length]
            })
        }

        for(var i=0;i<column.length;i++){
            var catLocation = categoryLocation(column[i]);

            if(catLocation!=-1){
                categories[catLocation].count++;
            }
        }

        for(var i=0;i<categories.length;i++){
            categories[i].boxes = round((categories[i].count/column.length) * (boxes_down * boxes_across));
        }
    }

    function addBoxes(){
        var currentCategory = 0;
        var currentCategoryBox = 0;

        var boxWidth = width/boxes_across;
        var boxHeight = height/boxes_down;
        for(var i=0;i<boxes_down;i++){
            boxes.push([]);
            for(var j=0;j<boxes_across;j++){
                if(currentCategoryBox == categories[currentCategory].boxes){
                    currentCategoryBox=0;
                    currentCategory++;
                }
                boxes[i].push(new Box(x+(j*boxWidth),y+(i * boxHeight),boxWidth,boxHeight,categories[currentCategory]));
                currentCategoryBox++;
            }
        }
    }

    addCategories();
    addBoxes();

    this.draw = function(){
        //draw waffle diagram 
        
        fill(0);
        textSize(20);
        textAlign(LEFT,BOTTOM);
        text(columnHeading,x,y);        
        for(var i=0;i<boxes.length;i++){
            for(var j=0;j<boxes[i].length;j++){

                if(boxes[i][j].category != undefined){
                    boxes[i][j].draw();
                }
            }
        }    

            //LEGENDS        
if(possibleValues[0] != "Take-away" ){ 
    //legend for other graphs
    for(var j =0; j < listName.length; j++)
        {
                fill(0);
                textSize(13);
                strokeWeight(0);

                text(listName[j],j * 175 - width * 2,height * 0.85);

                for (var i = 0; i <lists[j].length; i++)
                {
                    fill(colours[i]);
                    rect(j*180 - width * 2,20*i + height * 0.85, 40, 15);
                    textSize(10);
                    strokeWeight(0);
                    // text(lists[j],480,515 + i*20);
                    fill(0);
                    text(lists[j][i],j * 180 - width * 1.75,  i * 20 + height * 0.85 + 15);
                }

            }
            strokeWeight(1);
        }
    else {
        // legend for weekly meals
        for(var i=0; i<colours.length; i++)
        {
            fill(colours[i]);
            rect(width/6 - 60 ,height * 0.85+ 20*i ,40,15);
            fill(0)
            textSize(10);
            strokeWeight(0);
            // text(possibleValues[i],480,515 + i*20);
            text(possibleValues[i],width/6,height* 0.9 + i*20);

            strokeWeight(1);
        }
    }
        //END OF LEGEND

    }

    this.checkMouse = function(mouseX,mouseY){
        for(var i=0;i<boxes.length;i++){
            for(var j=0;j<boxes[i].length;j++){

                if(boxes[i][j].category!=undefined){
                    var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                    if(mouseOver!=false){
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(mouseOver);
                        textAlign(LEFT,TOP);
                        rect(mouseX, mouseY, tWidth+20,40);
                        fill(255);
                        text(mouseOver, mouseX + 10, mouseY+10);
                        break;
                    }
                }
            }

        }
    }
    

}