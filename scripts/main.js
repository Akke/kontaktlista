/*
    Alla kontakter sparas i contactArray, som uppdateras när kontakter skapas,
    raderas och uppdateras. Varje kontakt element för ett "unikt ID" för att 
    identifiera det lättare.
    Det finns egentligen ingen användning av variabeln om man inte vill spara 
    det i t.ex. en databas.
*/
var contactArray = []

/*
    FUNKTIONER
*/
function onClickEditContact(elem) {
    let img = elem.getElementsByTagName("img")[0]
    img.src = "images/save.svg"

    let li = elem.parentElement
    let inputs = li.getElementsByTagName("input")

    if(!li.classList.contains("editing")) {
        toggleInputs(inputs, false)

        li.classList.add("editing")
    } else {
        let tempInputs = []

        for(let i = 0; i < inputs.length; i++) {
            let validateResult = validateInput(inputs[i].value)
            if(!validateResult.success) {
                if(inputs[i].name == "name") {
                    displayError(`${validateResult.errorMessage} (Namn)`, "list")
                } else if(inputs[i].name == "phone") {
                    displayError(`${validateResult.errorMessage} (Telefonnummer)`, "list")
                }
                break
            }

            tempInputs.push(inputs[i])
        }

        if(inputs.length == tempInputs.length) {
            toggleInputs(tempInputs, true)

            for(let i = 0; i < tempInputs.length; i++) {
                contactArray.forEach((item) => {
                    if(item.element.id == tempInputs[i].parentElement.parentElement.id) {
                        item[tempInputs[i].name] = tempInputs[i].value
                    }
                })
            }

            li.classList.remove("editing")
        
            img.src = "images/edit.svg"
        }
    }
}

function toggleInputs(inputs, isDisabled) {
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = isDisabled
    }
}

function deleteAllContacts() {
    let contactsList = document.getElementsByClassName("contacts-list")[0]
    let ul = contactsList.getElementsByTagName("ul")[0]
    
    while(ul.firstChild) {
        deleteContact(ul.firstChild)
    }
}

function deleteContact(elem) {
    elem.remove()

    // enkelt sätt att ta bort från vår array
    contactArray = contactArray.filter(item => item.element.id !== elem.id) 

    updateContactCount()

    clearErrors()
}

function createContact(name, phone) {
    let contactsList = document.getElementsByClassName("contacts-list")[0]
    let ul = contactsList.getElementsByTagName("ul")[0]
    
    let li = document.createElement("li")

    // skapa ett "unikt ID" för varje element så de kan identifieras lättare
    let id = "id" + Math.random().toString(16).slice(2)
    li.id = id

    li.innerHTML = `<div class="input-container">
                            <div class="icon icon-user"></div>
                            <input name="name" type="text" placeholder="Namn" value="${name}" disabled>
                        </div>
                        <div class="input-container">
                            <div class="icon icon-number"></div>
                            <input name="phone" type="text" placeholder="Telefon" value="${phone}" disabled>
                        </div>
                        <button class="edit">
                            <img src="images/edit.svg">
                        </button>
                        <button class="delete">
                            <img src="images/delete.svg">
                        </button>`
    
    let element = ul.insertBefore(li, ul.firstChild)

    contactArray.push({
        name: name,
        phone: phone,
        element: element
    })

    updateContactCount()

    clearErrors()
}

function updateContactCount() {
    let contactsList = document.getElementsByClassName("contacts-list")[0]
    let ul = contactsList.getElementsByTagName("ul")[0]

    let contactCount = contactsList.getElementsByClassName("contact-count")[0]

    contactCount.innerHTML = ul.children.length
}

function validateInput(input) {
    if(input.trim() == "" || input.length < 1) {
        return {
            success: false,
            errorMessage: "Fältet får inte vara tomt."
        }
    }

    return {
        success: true
    }
}

function displayError(errorText, errorType) {
    let errorElement 
    
    if(errorType == "form") {
        errorElement = document.getElementsByClassName("form-error")[0]
    } else if(errorType == "list") {
        errorElement = document.getElementsByClassName("contacts-error")[0]
    }

    if(!errorElement) return;
    
    errorElement.style.display = "block"

    errorElement.innerHTML = errorText
}

function clearErrors() {
    let contactCreationErrors = document.getElementsByClassName("form-error")[0]
    if(contactCreationErrors) {
        contactCreationErrors.style.display = "none"
    }

    let contactListErrors = document.getElementsByClassName("contacts-error")[0]
    if(contactListErrors) {
        contactListErrors.style.display = "none"
    }
}

/*
    EVENTS
*/
let form = document.getElementsByClassName("contact-form")[0]

form.addEventListener("submit", function(e) {
    e.preventDefault() // gör så att sidan inte laddas om

    const formData = new FormData(form)

    let name = formData.get("name")

    let validateName = validateInput(name)
    if(!validateName.success) {
        displayError(`${validateName.errorMessage} (Namn)`, "form")
        return
    }

    let phone = formData.get("phone")

    let validatePhoneNumber = validateInput(phone)
    if(!validatePhoneNumber.success) {
        displayError(`${validatePhoneNumber.errorMessage} (Telefonnummer)`, "form")
        return
    }

    createContact(name, phone)

    form.reset() // töm vårt formulär
})

/*
    Vi lägger till en eventlistener till document av en anledning:
    När vi skapar nya element dynamiskt med "insertBefore" så går det inte att lägga till en ny eventlistener för det nya elementet på samma sätt.
    Då är det lättare att istället lyssna på när man klickar vart som helst på sidan och sen kolla vad klassnamnet på det elementet är, och matcha på det sättet.
*/
document.addEventListener("click", function(e) {
    let target = e.target
    
    // ta bort kontakt
    if(target.closest(".delete")) {
        deleteContact(target.parentElement)
    }

    // ändra kontakt
    if(target.closest(".edit")) {
        onClickEditContact(target)
    }
    
    // töm kontaktlista
    if(target.closest(".delete-list")) {
        deleteAllContacts()
    }
})