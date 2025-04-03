const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll(".input-field");
const progressBar = document.querySelector(".progress-bar");
const progressValue = document.querySelector(".progress");
const boxQuote = document.querySelector(".box-quote");
const clearData = document.querySelector('.clear-form-data')

const allQuotes = [
    "Raise the bar by completing your goals!",
    "Well begun is half done!",
    "Just a step away, keep going!",
    "Wuhu! You just completed all the goals, time to chill!"
]

const defaultData = {
    first: {
        name: '',
        completed: false
    },
    second: {
        name: '',
        completed: false
    },
    third: {
        name: '',
        completed: false
    }
};
// storing the data in local storage
// for the first time the data will be empty but after filling the fields,
// we are picking the data from the local storage to store in the fields if
// the page is reloaded to avoid data loss
const allGoals = JSON.parse(localStorage.getItem("allGoals")) || defaultData;

//check how many goals are completed // convert obj to array then filter out the
// completed one's
let completedGoalsCount = Object.values(allGoals).filter((goal) => goal.completed).length;

// to set the filling of the progress bar 
progressValue.style.width = `${(completedGoalsCount / inputFields.length) * 100}%`

checkBoxList.forEach((element) => {
    element.addEventListener("click", (e) => {
        const inputId = element.nextElementSibling.id;

        // inputFields is a node list, so converting it to array and then
        // checking that every input fields are filled
        // if filled then truthy value is returned else falsy
        const allFieldsFilled = [...inputFields].every((input) => {
            return input.value;
        });
        if (allFieldsFilled) {
            element.parentElement.classList.toggle("completed");
            allGoals[inputId].completed = !allGoals[inputId].completed;
            completedGoalsCount = Object.values(allGoals).filter((goal) => goal.completed).length;

            // to update the quotes based on the goals completed
            boxQuote.innerText = allQuotes[completedGoalsCount]

            // to update the filling of the progress bar based on the goals completed
            progressValue.style.width = `${(completedGoalsCount / inputFields.length) * 100}%`;

            // to update the value of the progress bar text of how many goals 
            // completed out of 3.
            progressValue.firstElementChild.innerText = `${completedGoalsCount}/ ${inputFields.length} Completed`;

            // update the data in local storage
            localStorage.setItem("allGoals", JSON.stringify(allGoals));
        } else {
            progressBar.classList.add("show-error");
        }
    });
});

// if the user starts typing in the fields then the error will disappear
inputFields.forEach((input) => {

    // setting th value from the data present in local storage
    input.value = allGoals[input.id]?.name;

    if (allGoals[input.id]?.completed) {
        input.parentElement.classList.add("completed");
    }

    input.addEventListener("focus", () => {
        progressBar.classList.remove("show-error");
    });

    // getting the field writing inside.
    input.addEventListener("input", () => {

        //if the user marked the task completed then the input field cannot be 
        // edited until marked completed, to edit it we need to mark it incomplete 
        if (allGoals[input.id]?.completed) {
            input.value = allGoals[input.id]?.name
            return
        }

        allGoals[input.id].name = input.value;

        localStorage.setItem("allGoals", JSON.stringify(allGoals));
    });

    //clear the form data at once
    clearData.addEventListener("click", () => {

        // Reset local storage to defaultData
        localStorage.setItem("allGoals", JSON.stringify(defaultData));

        // Reset the allGoals object in memory
        Object.assign(allGoals, defaultData);

        // Reset input fields
        inputFields.forEach(input => {
            input.value = "";
            input.parentElement.classList.remove("completed");
        });

        // Reset checkboxes
        checkBoxList.forEach(checkbox => {
            checkbox.parentElement.classList.remove("completed");
        });

        // Reset progress bar
        completedGoalsCount = 0;
        progressValue.style.width = "0%";
        progressValue.firstElementChild.innerText = `0/${inputFields.length} Completed`;

        // Reset the quote text
        boxQuote.innerText = allQuotes[0];
    })
});
