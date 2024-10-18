const ctx = document.getElementById("eventChart").getContext("2d");

// Check if dark mode is active
const isDarkMode = document.body.classList.contains("dark-mode");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Event Registrations",
        data: [800, 900, 750, 600, 1100, 1000, 900, 850, 950, 1000, 1100, 1200],
        backgroundColor: "#8576FF",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#F2F2F7" : "#000000", 
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#F2F2F7" : "#000000", // White text in dark mode
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#F2F2F7" : "#000000", 
        },
      },
    },
  },
});

// Sidebar Collapse
document.querySelector(".collapse-btn").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("collapsed");

  // Change collapse button text when sidebar is collapsed or expanded
  const collapseBtn = document.querySelector(".collapse-btn");
  if (sidebar.classList.contains("collapsed")) {
    collapseBtn.textContent = "Expand";
    collapseBtn.style.fontSize = "8px";
  } else {
    collapseBtn.textContent = "Collapse";
    collapseBtn.style.fontSize = "14px";
  }
});

// Carousel
// let currentSlide = 0;
// const slides = document.querySelectorAll(".slide");
// document.querySelector(".next").addEventListener("click", () => {
//   slides[currentSlide].style.display = "none";
//   currentSlide = (currentSlide + 1) % slides.length;
//   slides[currentSlide].style.display = "block";
// });
// document.querySelector(".prev").addEventListener("click", () => {
//   slides[currentSlide].style.display = "none";
//   currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//   slides[currentSlide].style.display = "block";
// });

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
  });
}

showSlide(currentSlide);

document.querySelector(".next").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
  resetAutoSlide();
});

document.querySelector(".prev").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
  resetAutoSlide();
});

let autoSlideInterval = setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);
}

// Modal open function
function openModal(eventDetails) {
  const modal = document.getElementById("eventModal");

  modal.querySelector("h2").textContent = eventDetails.name;
  modal.querySelector("h3").textContent = eventDetails.date;
  modal.querySelector(".description").textContent = eventDetails.description;

  const speakersDiv = modal.querySelector(".speakers");
  speakersDiv.innerHTML = "";

  eventDetails.speakers.forEach((speaker, index) => {
    const img = document.createElement("img");
    img.src = `./icons/avatar${index + 1}.png`;
    img.alt = speaker.name;
    img.title = speaker.name;
    speakersDiv.appendChild(img);
  });

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}

function handleRowClick(event) {
  const row = event.currentTarget;
  const eventName = row.cells[0].textContent;
  const eventDate = row.cells[1].textContent;
  const speakerNames = row.cells[2].textContent
    .split(",")
    .map((speaker) => speaker.trim());

  const eventDetails = {
    name: eventName,
    date: eventDate,
    description: `${eventName} is scheduled on ${eventDate}.`,
    speakers: speakerNames.map((name, index) => ({ name })),
  };

  openModal(eventDetails);
}

document.querySelectorAll(".events-table tbody tr").forEach((row) => {
  row.addEventListener("click", handleRowClick);
});

const rowsPerPage = 10;
let currentPage = 1;

function paginate() {
  const rows = document.querySelectorAll(".events-table tbody tr");
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  rows.forEach((row, index) => {
    row.style.display =
      index >= (currentPage - 1) * rowsPerPage &&
      index < currentPage * rowsPerPage
        ? ""
        : "none";
  });

  document.querySelector(".page-number").textContent = currentPage;
}

document.querySelectorAll(".pagination-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isNext = btn.textContent === "›";
    currentPage = isNext
      ? Math.min(currentPage + 1, totalPages)
      : Math.max(currentPage - 1, 1);
    paginate();
  });
});

paginate();

function toggleMobileImages() {
  const mobileImages = document.getElementById("mobile-images");
  mobileImages.classList.toggle("active");
}

function toggleDetails(button) {
  const dropdownContent = button.nextElementSibling;
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
    button.textContent = "Show Details";
  } else {
    dropdownContent.style.display = "block";
    button.textContent = "Hide Details";
  }
}

function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");


  const chartInstance = Chart.getChart(ctx); 
  chartInstance.options.scales.y.ticks.color = isDarkMode
    ? "#F2F2F7"
    : "#000000";
  chartInstance.options.scales.x.ticks.color = isDarkMode
    ? "#F2F2F7"
    : "#000000";
  chartInstance.options.plugins.legend.labels.color = isDarkMode
    ? "#F2F2F7"
    : "#000000";
  chartInstance.update(); 
}

document
  .getElementById("darkModeToggle")
  .addEventListener("click", toggleDarkMode);

window.addEventListener("DOMContentLoaded", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "enabled") {
    document.body.classList.add("dark-mode");
  }
});

// function toggleDarkMode() {
//   const body = document.body;
//   const isDarkMode = body.classList.toggle("dark-mode");
//   localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
// }

// document
//   .getElementById("darkModeToggle")
//   .addEventListener("click", toggleDarkMode);

// window.addEventListener("DOMContentLoaded", () => {
//   const darkModeSetting = localStorage.getItem("darkMode");
//   if (darkModeSetting === "enabled") {
//     document.body.classList.add("dark-mode");
//   }
// });
