// Debug version of script.js
console.log('Debug script loaded');

// Global variables
let isLoggedIn = false;
let currentUser = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - debug version');
    
    // Test edit button
    const editButton = document.getElementById('editButton');
    if (editButton) {
        console.log('Edit button found in debug version');
        
        editButton.addEventListener('click', function(e) {
            console.log('Edit button clicked in debug version!');
            e.preventDefault();
            alert('Edit button berhasil diklik!');
        });
    } else {
        console.error('Edit button not found in debug version!');
    }
    
    // Test form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        console.log('Edit form found in debug version');
        
        editForm.addEventListener('submit', function(e) {
            console.log('Form submitted in debug version!');
            e.preventDefault();
            alert('Form berhasil di-submit!');
        });
    } else {
        console.error('Edit form not found in debug version!');
    }
});
