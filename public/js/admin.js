// public/js/admin.js
const adminManager = {
    // Use a relative path for the API base URL. Vercel will handle the routing
    // to your serverless functions located in the /api directory.
    apiBaseUrl: '/api',

    data: {
        projects: [],
        resources: [],
        courses: [],
        contacts: []
    },

    init: function() {
        this.setupEventListeners();
        // Set a default active tab if none is specified
        this.activeTab = 'projects'; 
        this.switchTab(this.activeTab); 
    },

    setupEventListeners: function() {
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        const modal = document.getElementById('adminModal');
        const contactModal = document.getElementById('contactDetailModal');
        const closeButtons = document.querySelectorAll('.modal-close');
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
                contactModal.style.display = 'none';
            });
        });

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
            if (event.target === contactModal) {
                contactModal.style.display = 'none';
            }
        };

        document.getElementById('adminModalContent').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e.target);
        });
    },

    loadData: async function(type) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/${type}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            this.data[type] = await response.json();
            this.renderList(type);

            if (type === 'contacts') {
                this.updateContactStats();
            }
        } catch (error) {
            console.error(`Error loading ${type}:`, error);
            if (typeof AlertManager !== 'undefined') {
                AlertManager.show('Failed to load data. Please check server connection.', 'error');
            }
        }
    },

    switchTab: function(tabName) {
        document.querySelector(`.tab-btn.active`)?.classList.remove('active');
        document.querySelector(`.tab-content.active`)?.classList.remove('active');

        document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.activeTab = tabName;
        this.loadData(tabName);
    },

    renderList: function(tabName) {
        const listElement = document.getElementById(`${tabName}List`);
        listElement.innerHTML = '';
        const items = this.data[tabName];

        if (items.length === 0) {
            listElement.innerHTML = `<div class="text-center text-muted mt-3">No items found.</div>`;
            return;
        }

        if (tabName === 'contacts') {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('admin-list-item', 'contact-item');
                if (!item.isRead) itemDiv.classList.add('unread');
                itemDiv.innerHTML = `
                    <div class="item-details">
                        <h4>${item.subject} <span class="contact-name">by ${item.name}</span></h4>
                        <p>${item.message.substring(0, 100)}...</p>
                        <small>${new Date(item.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-icon" onclick="adminManager.showContactDetail('${item._id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-icon btn-danger" onclick="adminManager.deleteItem('contacts', '${item._id}')">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                `;
                listElement.appendChild(itemDiv);
            });
        } else {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('admin-list-item');
                itemDiv.innerHTML = `
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <p>${item.description.substring(0, 150)}...</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-icon" onclick="adminManager.showEditModal('${tabName}', '${item._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-icon btn-danger" onclick="adminManager.deleteItem('${tabName}', '${item._id}')">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                `;
                listElement.appendChild(itemDiv);
            });
        }
    },

    updateContactStats: function() {
        const total = this.data.contacts.length;
        const unread = this.data.contacts.filter(c => !c.isRead).length;
        document.getElementById('totalContacts').textContent = `${total} Total`;
        document.getElementById('unreadContacts').textContent = `${unread} Unread`;
    },

    showAddModal: function(type) {
        const modalContent = document.getElementById('adminModalContent');
        modalContent.innerHTML = this.getFormHTML(type);
        document.getElementById('adminModal').style.display = 'block';
    },

    showEditModal: function(type, id) {
        const item = this.data[type].find(i => i._id === id);
        const modalContent = document.getElementById('adminModalContent');
        modalContent.innerHTML = this.getFormHTML(type, item);
        document.getElementById('adminModal').style.display = 'block';
    },

    getFormHTML: function(type, item = null) {
    const isEdit = item !== null;
    const formattedType = type.slice(0, -1).charAt(0).toUpperCase() + type.slice(0, -1).slice(1);
    let html = `
        <h3>${isEdit ? 'Edit' : 'Add'} ${formattedType}</h3>
        <form data-type="${type}" data-id="${isEdit ? item._id : ''}">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" value="${isEdit ? item.title : ''}" required style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="5" required style="width: 100%; min-height: 150px; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary); resize: vertical;">${isEdit ? item.description : ''}</textarea>
            </div>
    `;

    if (type === 'projects') {
        html += `
            <div class="form-group">
                <label for="image">Image URL</label>
                <input type="text" id="image" name="image" value="${isEdit ? item.image : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="technologies">Technologies (comma-separated)</label>
                <input type="text" id="technologies" name="technologies" value="${isEdit && item.technologies ? item.technologies.join(', ') : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status" required style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
                    <option value="planning" ${isEdit && item.status === 'planning' ? 'selected' : ''}>Planning</option>
                    <option value="in-progress" ${isEdit && item.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${isEdit && item.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <div class="form-group">
                <label for="demoUrl">Demo URL</label>
                <input type="text" id="demoUrl" name="demoUrl" value="${isEdit ? item.demoUrl : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="githubUrl">GitHub URL</label>
                <input type="text" id="githubUrl" name="githubUrl" value="${isEdit ? item.githubUrl : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
        `;
    } else if (type === 'resources') {
        html += `
            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" name="category" required style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
                    <option value="frontend" ${isEdit && item.category === 'frontend' ? 'selected' : ''}>Frontend</option>
                    <option value="backend" ${isEdit && item.category === 'backend' ? 'selected' : ''}>Backend</option>
                    <option value="tools" ${isEdit && item.category === 'tools' ? 'selected' : ''}>Tools</option>
                    <option value="design" ${isEdit && item.category === 'design' ? 'selected' : ''}>Design</option>
                    <option value="documentation" ${isEdit && item.category === 'documentation' ? 'selected' : ''}>Documentation</option>
                </select>
            </div>
            <div class="form-group">
                <label for="url">URL</label>
                <input type="text" id="url" name="url" value="${isEdit ? item.url : ''}" required style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="icon">Icon Class (e.g., fas fa-code)</label>
                <input type="text" id="icon" name="icon" value="${isEdit ? item.icon : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
        `;
    } else if (type === 'courses') {
        html += `
            <div class="form-group">
                <label for="image">Image URL</label>
                <input type="text" id="image" name="image" value="${isEdit ? item.image : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="duration">Duration</label>
                <input type="text" id="duration" name="duration" value="${isEdit ? item.duration : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="level">Level</label>
                <select id="level" name="level" required style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
                    <option value="beginner" ${isEdit && item.level === 'beginner' ? 'selected' : ''}>Beginner</option>
                    <option value="intermediate" ${isEdit && item.level === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option value="advanced" ${isEdit && item.level === 'advanced' ? 'selected' : ''}>Advanced</option>
                </select>
            </div>
            <div class="form-group">
                <label for="instructor">Instructor</label>
                <input type="text" id="instructor" name="instructor" value="${isEdit ? item.instructor : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="modules">Modules (comma-separated)</label>
                <input type="text" id="modules" name="modules" value="${isEdit && item.modules ? item.modules.join(', ') : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="skills">Skills (comma-separated)</label>
                <input type="text" id="skills" name="skills" value="${isEdit && item.skills ? item.skills.join(', ') : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label for="certificateUrl">Certificate URL</label>
                <input type="text" id="certificateUrl" name="certificateUrl" value="${isEdit ? item.certificateUrl : ''}" style="width: 100%; padding: 12px; font-size: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--glass-bg); color: var(--text-primary);">
            </div>
        `;
    }

    html += `<button type="submit" class="btn btn-primary mt-2">${isEdit ? 'Update' : 'Add'}</button></form>`;
    return html;
},

    handleFormSubmit: async function(form) {
        const type = form.dataset.type;
        const id = form.dataset.id;
        const data = {};

        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            if (key === 'technologies' || key === 'modules' || key === 'skills') {
                data[key] = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            } else {
                data[key] = value;
            }
        }
        
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${this.apiBaseUrl}/${type}/${id}` : `${this.apiBaseUrl}/${type}`;
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Server response was not ok.');
            
            this.loadData(type);
            if (typeof ModalManager !== 'undefined') {
                ModalManager.hide('adminModal');
            }
            if (typeof AlertManager !== 'undefined') {
                AlertManager.show(`Item ${id ? 'updated' : 'added'} successfully.`, 'success');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            if (typeof AlertManager !== 'undefined') {
                AlertManager.show('Failed to save data. Please try again.', 'error');
            }
        }
    },

    deleteItem: async function(type, id) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/${type}/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Server response was not ok.');
                
                this.loadData(type);
                if (typeof AlertManager !== 'undefined') {
                    AlertManager.show('Item deleted successfully.', 'success');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                if (typeof AlertManager !== 'undefined') {
                    AlertManager.show('Failed to delete item. Please try again.', 'error');
                }
            }
        }
    },

    showContactDetail: async function(id) {
        const contact = this.data.contacts.find(c => c._id === id);
        if (contact) {
            try {
                if (!contact.isRead) {
                    await fetch(`${this.apiBaseUrl}/contacts/${id}/read`, { method: 'PUT' });
                    contact.isRead = true;
                    this.updateContactStats();
                    this.renderList('contacts');
                }
            } catch (error) {
                console.error('Error updating contact status:', error);
            }

            const modalContent = document.getElementById('contactDetailContent');
            modalContent.innerHTML = `
                <h3>Contact Message from ${contact.name}</h3>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Date:</strong> ${new Date(contact.createdAt).toLocaleDateString()}</p>
                <div class="message-box">
                    <p>${contact.message}</p>
                </div>
            `;
            if (typeof ModalManager !== 'undefined') {
                ModalManager.show('contactDetailModal');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        adminManager.init();
    }
});