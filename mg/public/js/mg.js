// MG Custom Scripts for Frappe - Enhanced Version

console.log('MG Custom App Loaded');

frappe.provide('mg');

// Initialize MG Custom App
mg.init = function() {
    console.log('Frappe App Ready - Applying MG Customizations');
    
    // Add theme class to body
    $('body').addClass('mg-theme');
    
    // Apply fade-in animation to dynamically loaded content
    mg.utils.applyFadeIn();
    
    // Enhance form controls
    mg.utils.enhanceFormControls();
    
    // Add smooth scrolling
    mg.utils.enableSmoothScroll();
    
    // Enhance tooltips
    mg.utils.enhanceTooltips();
    
    // Add keyboard shortcuts (minimal)
    mg.utils.setupKeyboardShortcuts();
    
    // Customize help menu immediately and on various events
    mg.customizeHelpMenu();
};

// Customize Help Menu - More aggressive approach
mg.customizeHelpMenu = function() {
    // Multiple strategies to find and customize the help menu
    
    // Strategy 1: Direct DOM manipulation with multiple selectors
    const customizeMenuItems = function() {
        // Find help menu dropdown - try multiple selectors
        let helpDropdown = null;
        
        // Try different selectors for help menu
        const selectors = [
            '.dropdown-help .dropdown-menu',
            '.help-menu .dropdown-menu',
            '.navbar .dropdown-menu:has(a[href*="about"])',
            '.navbar .dropdown-menu:has(a[href*="support"])',
            '[data-toggle="dropdown"]:contains("Help") + .dropdown-menu',
            '.navbar-nav .dropdown-menu'
        ];
        
        for (let selector of selectors) {
            const $menu = $(selector);
            if ($menu.length && ($menu.text().toLowerCase().includes('about') || $menu.text().toLowerCase().includes('support'))) {
                helpDropdown = $menu;
                break;
            }
        }
        
        // If not found, try finding by parent
        if (!helpDropdown || helpDropdown.length === 0) {
            $('.navbar [data-toggle="dropdown"]').each(function() {
                const $toggle = $(this);
                const text = $toggle.text().toLowerCase();
                if (text.includes('help') || text.includes('user')) {
                    const $menu = $toggle.next('.dropdown-menu');
                    if ($menu.length) {
                        helpDropdown = $menu;
                        return false; // break
                    }
                }
            });
        }
        
        if (helpDropdown && helpDropdown.length) {
            console.log('Found help menu, customizing...');
            
            // Clear all existing items
            helpDropdown.empty();
            
            // Add "About MGH" item
            const aboutItem = $(`
                <li>
                    <a href="#" class="dropdown-item" id="mg-about-mgh">
                        <span>About MGH</span>
                    </a>
                </li>
            `);
            aboutItem.find('a').on('click', function(e) {
                e.preventDefault();
                frappe.msgprint({
                    title: __('About MGH'),
                    message: __('MGH Custom Application'),
                    indicator: 'blue'
                });
            });
            helpDropdown.append(aboutItem);
            
            // Add "MGH Support" item
            const supportItem = $(`
                <li>
                    <a href="/support" class="dropdown-item" id="mg-support" target="_blank">
                        <span>MGH Support</span>
                    </a>
                </li>
            `);
            helpDropdown.append(supportItem);
            
            console.log('Help menu customized successfully');
            return true;
        }
        
        return false;
    };
    
    // Strategy 2: Override Frappe's help menu initialization
    if (typeof frappe.ui.toolbar !== 'undefined') {
        // Override add_help_menu_item if it exists
        const originalAddHelpItem = frappe.ui.toolbar.add_help_menu_item;
        if (originalAddHelpItem) {
            frappe.ui.toolbar.add_help_menu_item = function() {
                // Don't add default items, we'll add our own
            };
        }
        
        // Clear help menu if method exists
        if (frappe.ui.toolbar.clear_help) {
            try {
                frappe.ui.toolbar.clear_help();
            } catch (e) {
                console.log('Could not clear help via API:', e);
            }
        }
    }
    
    // Try to customize immediately
    if (!customizeMenuItems()) {
        // Retry after delays
        setTimeout(customizeMenuItems, 500);
        setTimeout(customizeMenuItems, 1000);
        setTimeout(customizeMenuItems, 2000);
    }
    
    // Use MutationObserver to watch for menu changes
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            customizeMenuItems();
        });
        
        // Observe navbar for changes
        const navbar = document.querySelector('.navbar, .desktop-menu');
        if (navbar) {
            observer.observe(navbar, {
                childList: true,
                subtree: true
            });
        }
    }
};

// Utility Functions
mg.utils = {
    // Animate element with fade-in
    animate_element: function(selector, animation_class) {
        $(selector).addClass('animate__animated ' + animation_class);
    },
    
    // Apply fade-in to dynamically loaded content
    applyFadeIn: function() {
        // Apply to new list rows
        $(document).on('DOMNodeInserted', '.list-row, .grid-row', function() {
            $(this).addClass('fade-in');
        });
        
        // Apply to modals when opened
        $(document).on('show.bs.modal', '.modal', function() {
            $(this).find('.modal-content').addClass('fade-in');
        });
    },
    
    // Enhance form controls with better UX
    enhanceFormControls: function() {
        // Add focus states to form controls
        $(document).on('focus', '.form-control, .form-select', function() {
            $(this).closest('.form-group, .control-input-wrapper').addClass('is-focused');
        });
        
        $(document).on('blur', '.form-control, .form-select', function() {
            $(this).closest('.form-group, .control-input-wrapper').removeClass('is-focused');
        });
        
        // Add floating label effect if needed
        $(document).on('input change', '.form-control', function() {
            if ($(this).val()) {
                $(this).addClass('has-value');
            } else {
                $(this).removeClass('has-value');
            }
        });
    },
    
    // Enable smooth scrolling
    enableSmoothScroll: function() {
        $('html').css('scroll-behavior', 'smooth');
        
        // Smooth scroll for anchor links
        $(document).on('click', 'a[href^="#"]', function(e) {
            const target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 500);
            }
        });
    },
    
    // Enhance tooltips with better styling
    enhanceTooltips: function() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    },
    
    // Setup keyboard shortcuts (minimal - only essential ones)
    setupKeyboardShortcuts: function() {
        $(document).on('keydown', function(e) {
            // Escape to close modals
            if (e.key === 'Escape') {
                $('.modal.show').modal('hide');
            }
        });
    },
    
    // Show notification with custom styling
    showNotification: function(message, type = 'info', duration = 3000) {
        const alertClass = type === 'error' ? 'alert-danger' : 
                          type === 'success' ? 'alert-success' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        const notification = $(`
            <div class="alert ${alertClass} alert-dismissible fade show mg-notification" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: var(--shadow-lg);">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, duration);
    },
    
    // Format numbers with thousand separators
    formatNumber: function(num, decimals = 2) {
        return parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Custom Frappe Hooks
mg.hooks = {
    // Hook into form refresh
    onFormRefresh: function(frm) {
        // Add custom behavior when form is refreshed
        if (frm && frm.doc) {
            // Example: Add custom validation or styling
            mg.utils.enhanceFormControls();
        }
    },
    
    // Hook into list view load
    onListLoad: function(listview) {
        // Add custom behavior when list view loads
        setTimeout(function() {
            mg.utils.applyFadeIn();
        }, 100);
    },
    
    // Hook into page load
    onPageLoad: function() {
        // Apply customizations to the page
        mg.utils.enhanceFormControls();
        mg.utils.applyFadeIn();
    }
};

// Initialize when app is ready
$(document).on('app_ready', function() {
    mg.init();
});

// Also customize when menu is opened/clicked
$(document).on('click', '.navbar [data-toggle="dropdown"], .dropdown-toggle', function() {
    setTimeout(function() {
        mg.customizeHelpMenu();
    }, 50);
});

// Hook into route changes
frappe.router.on('change', function() {
    // Re-apply customizations on route change
    setTimeout(function() {
        mg.utils.enhanceFormControls();
        mg.utils.applyFadeIn();
        // Re-customize help menu
        mg.customizeHelpMenu();
    }, 100);
});

// Watch for DOM changes and re-customize
if (typeof MutationObserver !== 'undefined') {
    const menuObserver = new MutationObserver(function() {
        mg.customizeHelpMenu();
    });
    
    // Observe body for navbar changes
    const body = document.body;
    if (body) {
        menuObserver.observe(body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
}

// Hook into form refresh events
if (typeof frappe.ui.form !== 'undefined') {
    frappe.ui.form.on('*', 'refresh', function(frm) {
        mg.hooks.onFormRefresh(frm);
    });
}

// Export utilities globally for use in custom scripts
window.mg = mg;
