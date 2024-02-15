import { CommonService } from './shared/service/common.service';

const userTypeNavigationMap = {
    Admin: getAdminNavigations,
    Customer: getCustomerNavigations,
    Staff: getStaffNavigations,
};

function getAdminNavigations() {
    return [
        {
            id: 'home',
            title: 'Dashboard',
            type: 'basic',
            icon: 'heroicons_outline:chart-pie',
            link: '/admin/dashboard',
        },
        {
            id: 'management',
            title: 'Gestion',
            type: 'aside',
            icon: 'heroicons_outline:cog',
            link: '',
            children: [
                {
                    id: 'management.users',
                    title: 'Employés',
                    type: 'basic',
                    icon: 'heroicons_outline:user-group',
                    link: '/admin/management/staff',
                },
            ],
        },
    ];
}

function getCustomerNavigations() {
    return [];
}

function getStaffNavigations() {
    return [
        {
            id: 'home',
            title: 'Accueil',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/staff/home',
        },
    ];
}

export const navigations = (userType: string) => {
    let arrayMenu = [];

    let navigationFunction = userTypeNavigationMap[userType];
    if (navigationFunction) arrayMenu = navigationFunction();

    return {
        compact: arrayMenu,
        default: arrayMenu,
        futuristic: arrayMenu,
        horizontal: arrayMenu,
    };
};
