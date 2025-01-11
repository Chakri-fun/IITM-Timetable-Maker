function doGet(e){
  return HtmlService.createHtmlOutputFromFile("Page.html");
}

function AddTimeTableToCalendar(Courses) {
  const TemplateS = HtmlService.createHtmlOutputFromFile("Template.json.html").getContent();
  const Template = JSON.parse(TemplateS);
  //CalendarApp.createCalendar("Test")
  if(Courses["Is1stYear"]){
    for(let Course of Courses["Courses"]){
      const sub = String(Course["subject"]);
      const slot = Course["slot"];
      const loc = Course["location"];
      const TimingsList = Template["1stYear"].filter(item => item["label"] === slot)[0]["Timings"];
      for(let event of TimingsList){
        const dayS = event["Day"];
        var day;
        switch (dayS){
          case "Monday":
            day = CalendarApp.Weekday.MONDAY;
            break;
          case "Tuesday":
            day = CalendarApp.Weekday.TUESDAY;
            break;
          case "Wednesday":
            day = CalendarApp.Weekday.WEDNESDAY;
            break;
          case "Thursday":
            day = CalendarApp.Weekday.THURSDAY;
            break;
          case "Friday":
            day = CalendarApp.Weekday.FRIDAY;
            break;
          default:
            console.log("Error!");
        }
        const startTime = event["StartTime"].split(":").map(item => parseInt(item));
        const endTime = event["EndTime"].split(":").map(item => parseInt(item));
        try{
          const series = CalendarApp.createEventSeries(
            sub, 
            new Date(getNextDay(dayS ,new Date(Courses["SemStartDate"])).setHours(startTime[0], startTime[1])), 
            new Date(getNextDay(dayS ,new Date(Courses["SemStartDate"])).setHours(endTime[0], endTime[1])),
            CalendarApp.newRecurrence()
            .addWeeklyRule()
            .onlyOnWeekday(day)
            .until(new Date(Courses["SemEndDate"])),
            {location: loc},
          );
          if("Remainder" in Courses){
            if(!!Courses["Remainder"]){
              series.addPopupReminder(Courses["Remainder"]);
            }
          }else{
            series.addPopupReminder(15);
          }
        }catch(e){
          console.error('Failed with error %s', e.message);
        }
      }
    }
  }
}

function getNextDay (dayName, date) {
	var now = date.getDay();
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var day = days.indexOf(dayName.toLowerCase());
	var diff = day - now;
	diff = diff < 1 ? 7 + diff : diff;
	var nextDayTimestamp = date.getTime() + (1000 * 60 * 60 * 24 * diff);
	return new Date(nextDayTimestamp);
};