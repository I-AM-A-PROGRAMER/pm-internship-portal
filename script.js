document.addEventListener('DOMContentLoaded', () => {
    // DOM ELEMENTS
    const body = document.body;
    const appContainer = document.querySelector('.app-container');
    const appHeader = document.getElementById('app-header');
    const pageContainer = document.getElementById('page-container');
    const welcomeUser = document.getElementById('welcome-user');
    const logoutBtn = document.getElementById('logout-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const allPages = document.querySelectorAll('.page');
    const allTabs = document.querySelectorAll('.nav-tab');
    const dashboardPage = document.getElementById('dashboard-page');
    const formPage = document.getElementById('form-page');
    const appliedPage = document.getElementById('applied-page');
    const loadingPage = document.getElementById('loading-page');
    const resultsPage = document.getElementById('results-page');
    const dashboardTabBtn = document.getElementById('dashboard-tab-btn');
    const findInternshipTabBtn = document.getElementById('find-internship-tab-btn');
    const appliedTabBtn = document.getElementById('applied-tab-btn');
    const recommendationForm = document.getElementById('recommendation-form');
    const startOverBtn = document.getElementById('start-over-btn');
    const recommendationResultsList = document.getElementById('recommendation-results-list');
    const authModalBackdrop = document.getElementById('auth-modal-backdrop');
    const authModal = document.getElementById('auth-modal');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const internshipList = document.getElementById('internship-list');
    const applyModalBackdrop = document.getElementById('apply-modal-backdrop');
    const applyModalContent = document.getElementById('apply-modal-content');
    const appliedInternshipsList = document.getElementById('applied-internships-list');
    const toast = document.getElementById('toast-notification');
    let currentUser = null;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let dummyInternships = [];
    const locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Remote", "Chennai", "Pune"];
    const skills = ["Python", "JavaScript", "React", "Node.js", "Java", "SQL", "UI/UX Design", "Figma"];

    // FUNCTIONS
    const generateDummyInternships = () => {
        if (dummyInternships.length > 0) return;
        const data = [
            { id: 0, title: 'Web Developer', company: 'NITI Aayog', location: 'Delhi', stipend: '20000', duration: '3 Months', skills: ['HTML', 'CSS', 'JavaScript', 'React'], responsibilities: ['Develop new user-facing features', 'Build reusable code and libraries for future use'], requirements: ['Strong proficiency in JavaScript', 'Experience with React.js'], whoCanApply: ['Available for 3 months', 'Have relevant skills and interests'], description: 'Join our team as a Web Developer and work on exciting projects that make a difference.' },
            { id: 1, title: 'Data Scientist', company: 'MyGov India', location: 'Mumbai', stipend: '25000', duration: '6 Months', skills: ['Python', 'SQL', 'TensorFlow', 'Scikit-learn'], responsibilities: ['Process, cleanse, and verify the integrity of data', 'Create automated anomaly detection systems'], requirements: ['Experience with common data science toolkits', 'Good applied statistics skills'], whoCanApply: ['Available for 6 months', 'Pursuing a degree in Computer Science'], description: 'Work with large datasets to extract meaningful insights and help shape public policy.' },
            { id: 2, title: 'AI/ML Engineer', company: 'Prasar Bharati', location: 'Remote', stipend: '22000', duration: '4 Months', skills: ['PyTorch', 'Machine Learning', 'NLP'], responsibilities: ['Design and develop machine learning systems', 'Run machine learning tests and experiments'], requirements: ['Understanding of data structures and algorithms', 'Ability to write robust code in Python'], whoCanApply: ['Strong portfolio of AI projects', 'Excellent communication skills'], description: 'Develop and deploy machine learning models for a national audience.' },
        ];
        for (let i = 0; i < 50; i++) {
            const template = data[i % data.length];
            dummyInternships.push({ ...template, id: i, stipend: (20000 - i * 200).toString() });
        }
    };
    const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));
    const showPage = (pageToShow) => { allPages.forEach(p => p.classList.remove('active')); allTabs.forEach(b => b.classList.remove('active')); pageToShow.classList.add('active'); const tabMap = { 'dashboard-page': dashboardTabBtn, 'form-page': findInternshipTabBtn, 'applied-page': appliedTabBtn }; if (tabMap[pageToShow.id]) { tabMap[pageToShow.id].classList.add('active'); } if (pageToShow.id === 'applied-page') renderAppliedInternships(); };
    const updateUserState = (user) => { if (user) { currentUser = users.find(u => u.username === user.username); if (!currentUser.applied) currentUser.applied = []; welcomeUser.textContent = `Welcome, ${currentUser.fullName}!`; appHeader.style.display = 'flex'; pageContainer.style.display = 'block'; authModalBackdrop.style.display = 'none'; appContainer.classList.remove('blur'); showPage(dashboardPage); renderDashboard(); } else { currentUser = null; appHeader.style.display = 'none'; pageContainer.style.display = 'none'; authModalBackdrop.style.display = 'flex'; appContainer.classList.add('blur'); } };
    const renderDashboard = () => { internshipList.innerHTML = ''; dummyInternships.forEach(internship => { const item = document.createElement('div'); item.className = 'internship-item'; item.innerHTML = `<h3>${internship.title}</h3><p class="company">${internship.company}</p><div class="details"><span><i class="fa fa-map-marker-alt"></i> ${internship.location}</span><span><i class="fa fa-money-bill-wave"></i> ₹${internship.stipend}/month</span></div><p class="description">${internship.description}</p><button class="view-apply-btn" data-id="${internship.id}">View & Apply</button>`; internshipList.appendChild(item); }); };
    
    // UPDATED Apply Modal function
    const openApplyModal = (internshipId) => {
        const internship = dummyInternships.find(i => i.id == internshipId);
        applyModalContent.innerHTML = `
            <h3>${internship.title}</h3>
            <p><strong>${internship.company}</strong></p>
            
            <h4>Job Description</h4>
            <p>${internship.description}</p>
            
            <h4>Responsibilities</h4>
            <ul>${internship.responsibilities.map(item => `<li>${item}</li>`).join('')}</ul>

            <h4>Job Requirements</h4>
            <ul>${internship.requirements.map(item => `<li>${item}</li>`).join('')}</ul>

            <h4>Stipend</h4>
            <p>₹${internship.stipend} /month</p>

            <h4>Duration</h4>
            <p>${internship.duration}</p>

            <hr>
            
            <h4>Why would you like to join this internship?</h4>
            <div class="form-group"><textarea placeholder="Explain in 200 words..."></textarea></div>
            
            <h4>Upload your CV</h4>
            <div class="form-group"><input type="file"></div>

            <div class="modal-footer">
                <button class="submit-btn" id="modal-submit-btn" data-id="${internship.id}">Submit Application</button>
            </div>`;
        applyModalBackdrop.style.display = 'flex';
    };

    const renderAppliedInternships = () => { appliedInternshipsList.innerHTML = ''; if (!currentUser || !currentUser.applied || currentUser.applied.length === 0) { appliedInternshipsList.innerHTML = `<p>You haven't applied to any internships yet.</p>`; return; } currentUser.applied.forEach(app => { const internship = dummyInternships.find(i => i.id === app.id); const item = document.createElement('div'); item.className = 'applied-item'; item.innerHTML = `<div><h4>${internship.title}</h4><p>${internship.company}</p></div><p>${app.date}</p><span class="status-badge">${app.status}</span><button class="withdraw-btn" data-id="${internship.id}">Withdraw</button>`; appliedInternshipsList.appendChild(item); }); };
    const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); };
    const setupCustomSelect = (selectId, options, isSearchable = false) => { const selectElement = document.getElementById(selectId); const selectedDisplay = selectElement.querySelector('.select-selected'); const itemsContainer = selectElement.querySelector('.select-items'); let selectedValues = []; itemsContainer.innerHTML = ''; if (isSearchable) { const searchBox = document.createElement('input'); searchBox.type = 'text'; searchBox.placeholder = 'Search...'; searchBox.className = 'select-search'; itemsContainer.appendChild(searchBox); searchBox.addEventListener('keyup', () => { const filter = searchBox.value.toLowerCase(); itemsContainer.querySelectorAll('label').forEach(label => { const text = label.textContent.toLowerCase(); label.style.display = text.includes(filter) ? '' : 'none'; }); }); } options.forEach(optionText => { const label = document.createElement('label'); label.innerHTML = `<input type="checkbox" value="${optionText}"> ${optionText}`; itemsContainer.appendChild(label); }); selectedDisplay.addEventListener('click', (e) => { e.stopPropagation(); const isAlreadyOpen = !itemsContainer.classList.contains('select-hide'); closeAllSelects(); if (!isAlreadyOpen) { itemsContainer.classList.remove('select-hide'); selectedDisplay.classList.add('active'); } }); itemsContainer.addEventListener('change', () => { selectedValues = Array.from(itemsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value); selectedDisplay.textContent = selectedValues.length > 0 ? selectedValues.join(', ') : `Select...`; }); };
    function closeAllSelects() { document.querySelectorAll('.select-items').forEach(item => item.classList.add('select-hide')); document.querySelectorAll('.select-selected').forEach(item => item.classList.remove('active')); }
    document.addEventListener('click', closeAllSelects);
    darkModeToggle.addEventListener('click', () => { body.classList.toggle('dark-mode'); localStorage.setItem('darkMode', body.classList.contains('dark-mode')); darkModeToggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'; });
    const loadTheme = () => { const isDarkMode = localStorage.getItem('darkMode') === 'true'; if (isDarkMode) { body.classList.add('dark-mode'); darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; } };
    
    // EVENT LISTENERS
    showSignup.addEventListener('click', e => { e.preventDefault(); loginView.style.display = 'none'; signupView.style.display = 'block'; });
    showLogin.addEventListener('click', e => { e.preventDefault(); signupView.style.display = 'none'; loginView.style.display = 'block'; });
    signupForm.addEventListener('submit', e => { e.preventDefault(); const newUser = { fullName: document.getElementById('signup-fullname').value, username: document.getElementById('signup-username').value, password: document.getElementById('signup-password').value, applied: [] }; if (users.find(u => u.username === newUser.username)) { alert('Username already exists.'); return; } users.push(newUser); saveUsers(); updateUserState(newUser); });
    loginForm.addEventListener('submit', e => { e.preventDefault(); const username = document.getElementById('login-username').value; const password = document.getElementById('login-password').value; const user = users.find(u => u.username === username && u.password === password); if (user) { authModal.classList.add('success-pulse'); setTimeout(() => { updateUserState(user); authModal.classList.remove('success-pulse'); }, 800); } else { authModal.classList.add('shake'); setTimeout(() => authModal.classList.remove('shake'), 500); } });
    logoutBtn.addEventListener('click', () => updateUserState(null));
    dashboardTabBtn.addEventListener('click', () => showPage(dashboardPage));
    findInternshipTabBtn.addEventListener('click', () => showPage(formPage));
    appliedTabBtn.addEventListener('click', () => showPage(appliedPage));
    document.body.addEventListener('click', e => { if (e.target.classList.contains('view-apply-btn')) { openApplyModal(e.target.dataset.id); } if (e.target.id === 'modal-submit-btn') { const internshipId = parseInt(e.target.dataset.id, 10); currentUser.applied.unshift({ id: internshipId, date: new Date().toLocaleDateString(), status: 'In Review' }); saveUsers(); applyModalBackdrop.style.display = 'none'; showToast('Application Submitted!'); } if (e.target.classList.contains('withdraw-btn')) { const internshipId = parseInt(e.target.dataset.id, 10); currentUser.applied = currentUser.applied.filter(app => app.id !== internshipId); saveUsers(); renderAppliedInternships(); showToast('Application Withdrawn.'); } });
    applyModalBackdrop.addEventListener('click', e => { if (e.target === applyModalBackdrop || e.target.classList.contains('close-btn')) applyModalBackdrop.style.display = 'none'; });
    recommendationForm.addEventListener('submit', (e) => { e.preventDefault(); showPage(loadingPage); setTimeout(() => { recommendationResultsList.innerHTML = ''; for(let i=0; i<3; i++) { const internship = dummyInternships[i]; const item = document.createElement('div'); item.className = 'result-item'; item.innerHTML = `<h4>${internship.title}</h4><p>${internship.company} - ${internship.location}</p><p class="description">${internship.description.substring(0,100)}...</p><h5>Your Matched Skills:</h5><div><span class="skill-tag">${internship.skills[0]}</span> <span class="skill-tag">${internship.skills[1]}</span></div><button class="view-apply-btn" data-id="${internship.id}" style="width: auto; padding: 8px 15px; margin-top: 15px;">Apply Now</button>`; recommendationResultsList.appendChild(item); } showPage(resultsPage); }, 2500); });
    startOverBtn.addEventListener('click', () => showPage(dashboardPage));
    
    // INITIALIZATION
    loadTheme();
    generateDummyInternships();
    setupCustomSelect('location-select', locations);
    setupCustomSelect('skills-select', skills, true);
    updateUserState(null);
});