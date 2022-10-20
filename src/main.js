import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor01.style.transition = "ease .7s"
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccBgColor02.style.transition = "ease .7s"
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// Security Code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000{ - }0"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Expiration Date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{ / }YY",

  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Card Number - Verificação com Regex
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    // console.log(foundMask.cardtype)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Change Card Information  
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  setTimeout(() => {
    document.querySelector(".popup").classList.add("open")

    setTimeout(() => {
      document.querySelector(".popup").classList.add("close")
    }, 4000)

    setTimeout(() => {
      document.querySelector(".popup").classList.remove("open")
      document.querySelector(".popup").classList.remove("close")
    }, 4500)
  }, 500)
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolderValue = document.querySelector("#card-holder")
cardHolderValue.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerHTML = cardHolderValue.value.length === 0 ? "fulano da silva" : cardHolderValue.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardTypeFound = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardTypeFound)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccCardNumber = document.querySelector(".cc-number")
  ccCardNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpiratiionDate(expirationDateMasked.value)
})

function updateExpiratiionDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02 / 32" : date
}