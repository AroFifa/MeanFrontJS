import {
    CalendarConfig,
    EventModel,
    ProjectModelConfig,
} from '@bryntum/calendar';

export const getCalendarConfig = (
    editListener: any,
): Partial<CalendarConfig> => {
    return {
        date: new Date(),
        listeners: {
            beforeEventEdit({ eventRecord }) {
                editListener(eventRecord);
                return false;
            },
            beforeDragResizeEnd: async () => {
                return false;
            },
            beforeEventDelete() {
                return false;
            },
            beforeDragMoveEnd: async () => {
                return false;
            },
        },
    };
};

export const ressources = [
    {
        id: 1,
        name: 'Les rendez-vous',
        eventColor: 'blue',
    },
    {
        id: 3,
        name: 'Vos heures de travail',
        eventColor: 'green',
    },
    {
        id: 2,
        name: 'indisponible',
        eventColor: 'gray',
    },
];
