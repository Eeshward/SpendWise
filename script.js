const description = document.getElementById("description");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const type = document.getElementById("type");
const category = document.getElementById("category");

const transactionList = document.getElementById("transactionList");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const darkBtn = document.getElementById("darkBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

// Load Data
displayTransactions();
updateSummary();
loadTheme();

// ======================
// Add Transaction
// ======================

function addTransaction(){

    if(
        description.value.trim()==="" ||
        amount.value==="" ||
        date.value==="")
    {
        alert("Please fill all fields.");
        return;
    }

    const transaction={

        id:Date.now(),

        description:description.value,

        amount:Number(amount.value),

        date:date.value,

        type:type.value,

        category:category.value

    };

    transactions.unshift(transaction);

    saveData();

    description.value="";
    amount.value="";
    date.value="";
    category.selectedIndex=0;
    type.selectedIndex=0;

}

// ======================
// Display Transactions
// ======================

function displayTransactions(){

    transactionList.innerHTML="";

    transactions.forEach(item=>{

        const li=document.createElement("li");

        li.className=item.type==="Income"
        ?"income-item":"expense-item";

        li.innerHTML=`

        <div>

        <strong>${item.description}</strong><br>

        ${item.category} | ${item.date}

        </div>

        <div>

        ₹${item.amount}

        <button
        class="delete-btn"
        onclick="deleteTransaction(${item.id})">

        Delete

        </button>

        </div>

        `;

        transactionList.appendChild(li);

    });

}

// ======================
// Delete
// ======================

function deleteTransaction(id){

    transactions=transactions.filter(item=>item.id!==id);

    saveData();

}

// ======================
// Save
// ======================

function saveData(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();

    updateSummary();

}

// ======================
// Summary
// ======================

function updateSummary(){

    let totalIncome=0;

    let totalExpense=0;

    transactions.forEach(item=>{

        if(item.type==="Income"){

            totalIncome+=item.amount;

        }else{

            totalExpense+=item.amount;

        }

    });

    income.innerHTML="₹"+totalIncome;

    expense.innerHTML="₹"+totalExpense;

    balance.innerHTML="₹"+(totalIncome-totalExpense);

    updateChart(totalIncome,totalExpense);

}

// ======================
// Chart
// ======================

function updateChart(incomeValue,expenseValue){

    const ctx=document.getElementById("expenseChart");

    if(chart){

        chart.destroy();

    }

    chart=new Chart(ctx,{

        type:"pie",

        data:{

            labels:["Income","Expense"],

            datasets:[{

                data:[incomeValue,expenseValue],

                backgroundColor:[
                    "#4CAF50",
                    "#F44336"
                ],

                borderWidth:1

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

// ======================
// Dark Mode
// ======================

function loadTheme(){

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark");

        darkBtn.innerHTML="☀️ Light Mode";

    }

}

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        darkBtn.innerHTML="☀️ Light Mode";

    }else{

        localStorage.setItem("theme","light");

        darkBtn.innerHTML="🌙 Dark Mode";

    }

});