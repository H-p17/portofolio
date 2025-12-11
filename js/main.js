// ======================================================
// PORTFOLIO CRUD + ADMIN SETTINGS — FINAL VERSION
// ======================================================

let projects = JSON.parse(localStorage.getItem('projects')) || [];
let editingIndex = -1;

const modalEl = document.getElementById("projectModal");
let modal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

// ===== LOAD PROJECTS =====
function loadProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = "";

    const isAdmin = !!modalEl;

    if (projects.length === 0) {
        container.innerHTML = `<p class="text-muted text-center">No projects yet. Add your first project!</p>`;
        return;
    }

    projects.forEach((project, index) => {
        const item = document.createElement("div");
        item.className = isAdmin ? "card admin-card mb-3" : "col-md-4 mb-4 fade-in-up";

        if (isAdmin) {
            // Admin Card
            item.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${project.image || 'https://via.placeholder.com/200x150'}"
                             class="img-fluid rounded-start h-100 object-fit-cover"
                             style="max-height:150px">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text text-truncate">${project.description}</p>
                            ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ""}
                        </div>
                    </div>
                    <div class="col-md-2 d-flex flex-column justify-content-center align-items-center">
                        <button class="btn btn-warning btn-sm w-75 mb-2" onclick="editProject(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm w-75" onclick="deleteProject(${index})">Delete</button>
                    </div>
                </div>
            `;
        } else {
            // Public Card
            item.innerHTML = `
                <div class="card h-100 portfolio-card">
                    <img src="${project.image || 'https://via.placeholder.com/300x200'}"
                         class="card-img-top" alt="${project.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-white">${project.title}</h5>
                        <p class="card-text flex-grow-1 text-white">${project.description}</p>
                        ${project.link ? `<a href="${project.link}" target="_blank" class="btn btn-primary mt-auto text-white">Visit</a>` : ""}
                    </div>
                </div>
            `;
        }

        container.appendChild(item);
    });
}

// ===== SHOW ADD FORM =====
function showAddForm() {
    editingIndex = -1;
    document.getElementById("modalTitle").textContent = "Add Project";
    document.getElementById("projectForm").reset();
    document.getElementById("filePreview").innerHTML = "";
    modal.show();
}

// ===== EDIT PROJECT =====
function editProject(index) {
    editingIndex = index;
    const project = projects[index];
    document.getElementById("modalTitle").textContent = "Edit Project";
    document.getElementById("projectTitle").value = project.title;
    document.getElementById("projectDescription").value = project.description;
    document.getElementById("projectLink").value = project.link || "";
    document.getElementById("filePreview").innerHTML = project.image
        ? `<img src="${project.image}" class="preview-img" style="max-height:150px;">`
        : "";
    modal.show();
}

// ===== DELETE PROJECT =====
function deleteProject(index) {
    if (!confirm("Delete this project?")) return;
    projects.splice(index, 1);
    saveProjects();
}

// ===== SAVE PROJECT =====
function saveProject(e) {
    e.preventDefault();

    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const link = document.getElementById("projectLink").value.trim();
    const file = document.getElementById("projectImage").files[0];

    if (!title || !description) {
        alert("Title and description are required!");
        return;
    }

    let image = editingIndex >= 0 ? projects[editingIndex].image : null;
    const projectData = { title, description, link, image };

    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            projectData.image = ev.target.result;
            finalizeSave(projectData);
        };
        reader.readAsDataURL(file);
    } else {
        finalizeSave(projectData);
    }
}

// ===== FINALIZE SAVE =====
function finalizeSave(data) {
    if (editingIndex >= 0) {
        projects[editingIndex] = data;
    } else {
        projects.push(data);
    }

    saveProjects();
    modal.hide();
}

// ===== SAVE & UPDATE LOCAL STORAGE =====
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
    loadProjects();
    updateStats();
}

// ===== UPDATE DASHBOARD STATS =====
function updateStats() {
    document.getElementById("total-projects").textContent = projects.length;
    document.getElementById("projects-with-links").textContent = projects.filter(p => p.link).length;
    document.getElementById("projects-with-images").textContent = projects.filter(p => p.image).length;
}

// ===== EVENTS =====
document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    updateStats();
});

document.getElementById("openAdd")?.addEventListener("click", showAddForm);
document.getElementById("projectForm")?.addEventListener("submit", saveProject);
document.getElementById("settingsForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const newPass = document.getElementById('newPassword').value.trim();
    if(newPass){
        localStorage.setItem('adminPassword', newPass);
        alert('Password updated!');
        bootstrap.Modal.getOrCreateInstance(document.getElementById('settingsModal')).hide();
    }
});
