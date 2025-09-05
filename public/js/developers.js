document.addEventListener('DOMContentLoaded', () => {
    const developers = [
        {
            name: 'N.S.S.SAI GANESH',
            role: 'Frontend Developer, Project Manager',
            image: 'images/ganesh.jpg',
            linkedin: 'https://www.linkedin.com/in/ganesh-neeli-07863732a/',
            github: 'https://github.com/alwaysganesh09'
        },
        {
            name: 'K.S.V.M.S.MOURYA',
            role: 'Backend Developer, UI/UX Designer',
            image: 'images/mourya.jpg',
            linkedin: 'https://www.linkedin.com/in/sri-venkata-mallik-sri-mourya-kotha-088739313?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            github: 'https://github.com/MouryaKotha'
        },
        {
            name: 'Md Masthan Ahmed',
            role: 'Database Developer,DevOps Engineer',
            image: 'images/masthan.jpg',
            linkedin: 'https://www.linkedin.com/in/mohammad-masthan-ahmed-998b5a32a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
            github: 'https://github.com/amannn22'
        },
        {
            name: 'CHODI PRAVEEN',
            role: 'Frontend Developer, Graphic Designer',
            image: 'images/praveen.jpg',
            linkedin: 'https://www.linkedin.com/in/praveen-chodi/',
            github: 'https://github.com/chodi44'
        },
        {
            name: 'P RAHUL',
            role: 'Researcher and Content Writer',
            image: 'images/rahul.jpg',
            linkedin: 'https://www.linkedin.com/in/padala-rahul-04a63432a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            github: 'https://github.com/PRahul' // Placeholder, update as needed
        },
        {
            name: 'CH SHYAM',
            role: 'Backend Developer, Tester',
            image: 'images/shyam.jpg',
            linkedin: 'http://www.linkedin.com/in/shyam-sundar-22a0b2315',
            github: 'https://github.com/shyamsundar1439' // Placeholder, update as needed
        }
    ];

    const grid = document.querySelector('.developers-grid');

    if (grid) {
        grid.innerHTML = developers.map(dev => `
            <div class="developer-card card">
                <img src="${dev.image}" alt="${dev.name}" class="developer-photo">
                <h3>${dev.name}</h3>
                <p>Role: ${dev.role}</p>
                <div class="social-links">
                    ${dev.linkedin ? `
                        <a href="${dev.linkedin}" target="_blank" aria-label="LinkedIn Profile">
                            <i class="fab fa-linkedin"></i>
                        </a>
                    ` : ''}
                    ${dev.github ? `
                        <a href="${dev.github}" target="_blank" aria-label="GitHub Profile">
                            <i class="fab fa-github"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
});