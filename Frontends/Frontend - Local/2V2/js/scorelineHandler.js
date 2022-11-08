//This is updated to serve for teams, but needs checking and validation
function changeScoreline(teams,score) {
    if (teamsData[1] == teams[0]) {
        switch (score[0]) {
            case "0":
                document.getElementById("l1").style.opacity = 0;
                document.getElementById("l2").style.opacity = 0;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "1":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 0;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "2":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 0;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "3":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 0;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "4":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 0;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "5":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 0;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "6":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 1;
                document.getElementById("l7").style.opacity = 0;
                break;
            case "7":
                document.getElementById("l1").style.opacity = 1;
                document.getElementById("l2").style.opacity = 1;
                document.getElementById("l3").style.opacity = 1;
                document.getElementById("l4").style.opacity = 1;
                document.getElementById("l5").style.opacity = 1;
                document.getElementById("l6").style.opacity = 1;
                document.getElementById("l7").style.opacity = 1;
                break;
            default:
                break;
        }
    }
    if (teamsData[3] == teams[1]) {
        switch (score[1]) {
            case "0":
                document.getElementById("r1").style.opacity = 0;
                document.getElementById("r2").style.opacity = 0;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "1":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 0;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "2":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 0;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "3":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 0;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "4":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 0;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "5":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 0;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "6":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 1;
                document.getElementById("r7").style.opacity = 0;
                break;
            case "7":
                document.getElementById("r1").style.opacity = 1;
                document.getElementById("r2").style.opacity = 1;
                document.getElementById("r3").style.opacity = 1;
                document.getElementById("r4").style.opacity = 1;
                document.getElementById("r5").style.opacity = 1;
                document.getElementById("r6").style.opacity = 1;
                document.getElementById("r7").style.opacity = 1;
                break;
            default:
                break;
        }
    }

}