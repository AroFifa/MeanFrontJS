import {
    CalendarConfig,
    EventModel,
    ProjectModelConfig,
} from '@bryntum/calendar';

class NewModel extends EventModel {
    static get fields() {
        return [
            {
                name: 'startDate',
                type: 'date',
                format: 'DD-MM-YYYY HH:mm:ss',
            },
            { name: 'endDate', type: 'date', format: 'DD-MM-YYYY HH:mm:ss' },
            { name: 'resourceId', type: 'number', default: 1 },
            { name: 'name', type: 'string' },
        ];
    }
}

export const projectConfig: Partial<ProjectModelConfig> = {
    eventModelClass: NewModel,
};

export const getCalendarConfig = (
    editListener: any,
    deleteListener: any,
    dragListener: any,
): Partial<CalendarConfig> => {
    return {
        date: new Date(),
        listeners: {
            beforeEventEdit({ eventRecord }) {
                editListener(eventRecord);
                return false;
            },
            beforeDragResizeEnd: async ({ eventRecord }) => {
                return false;
            },
            beforeEventDelete({ eventRecords, context }) {
                deleteListener(eventRecords[0].data.id);
                return false;
            },
            beforeDragMoveEnd: async ({
                eventRecord,
                newStartDate,
                newEndDate,
            }) => {
                return await dragListener(
                    eventRecord.data.id,
                    newStartDate,
                    newEndDate,
                );
            },
        },
    };
};

export const remainders = [
    { label: 'Tout les heures', value: 'h' },
    { label: 'Tout les jours', value: 'd' },
    { label: 'Tout les semaines', value: 'w' },
];

export const ressources = [
    {
        id: 1,
        name: 'Vos rendez-vous',
        eventColor: 'green',
    },
    {
        id: 2,
        name: 'indisponible',
        eventColor: 'gray',
    },
];
