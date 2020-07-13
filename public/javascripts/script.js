const vueMessage = new Vue({
    el: "#app",
    data: {
        studentFirstName: '',
        studentLastName: '',
        currentStudentId: 0,
        studentsToView: [],
        notFoundStudents: [],
        currentStudentsList: [],
        date: '',
        getFullName: false,
        showSearch: false,
        showStudentSearch: false,
        showAddPayment: false,
        showAddStudent: false,
    },

    computed: {
        fullName: function () {
            return this.studentFirstName.concat(' ').concat(this.studentLastName)
        },

        paymentBallance: function () {
            return Number(this.totalLessons) / (Number(this.total) * Number(this.currentStudentRate));
        }
    },

    methods: {
        createNewStudent: function () {
            this.students.push(this.studentFirstName + ' ' + this.studentLastName);
        },

        getStudentId: async function () {
            const name = this.studentFirstName;
            const surname = this.studentLastName;
            if (!name || !surname) {
                return this.getFullName = true;
            };

            const response = await fetch(`http://localhost:3000/name?name=${name}&surname=${surname}`)
                .then(res => res.json());

            if (!response.student) {
                this.notFoundStudents.push(this.fullName);
            } else {
                return {
                    currentStudentId: response.student.id,
                    currentStudentRate: response.student.payment_rate
                };
            }

        },

        findPayment: function (name) {
            return Object.values(this.ballance)[Object.keys(this.ballance).indexOf(name)]
        },

        getStudentInfo: async function () {
            const idWithPaymentRate = await this.getStudentId();

            this.currentStudentId = idWithPaymentRate.currentStudentId;

            if (this.currentStudentId === 0) {
                return this.notFoundStudents.push(this.fullName);
            } else {
                const totalLessons = await fetch(`http://localhost:3000/students/${idWithPaymentRate.currentStudentId}/total-lessons`)
                    .then(res => res.json());

                const totalPayments = await fetch(`http://localhost:3000/students/${idWithPaymentRate.currentStudentId}/total-payments`)
                    .then(res => res.json());

                const totalPaymentsNumber = Number(totalPayments.totalPayments.total_payments);
                const totalLessonsNumber = Number(totalLessons.totalLessons.total_lessons);
                const currentStudentRate = Number(idWithPaymentRate.currentStudentRate);

                const lessonsLeft = (totalPaymentsNumber / currentStudentRate) - totalLessonsNumber;

                return this.studentsToView.push({
                    currentStudentId: idWithPaymentRate.currentStudentId,
                    name: this.fullName,
                    totalPayments: totalPaymentsNumber,
                    totalLessons: totalLessonsNumber,
                    currentStudentRate: currentStudentRate,
                    lessonsLeft: lessonsLeft
                });
            };
        },

        // clears the search results on the page by cleaning view array
        clearResults: function () {
            this.studentNotFound = false;
            this.getFullName = false;
            this.studentsToView = [];
            this.notFoundStudents = [];
            this.studentFirstName = '';
            this.studentLastName = '';
            this.currentStudentId = 0;
            this.showStudentSearch = false;
            this.currentStudentsList = [];
        },

        // shows all students in the database by  array to the array to be viewed
        getAllStudentsList: async function () {
            const response = await fetch('http://localhost:3000/students')
                .then(res => res.json());

            response.students.forEach(student => {
                this.currentStudentsList.push(student.name + ' ' + student.surname);
            })

            if (this.currentStudentsList.length > 0) {
                this.showStudentSearch = true;
            } else {
                this.notFoundStudents.push('No students');
            };
        },

        processPayment: function () {
            if (this.students.includes(fullName)) {

            } else {
                // if not found adds the name to the 'notFoundStudent' list
                // second if condition excludes double content
                if (!this.notFoundStudents.includes(this.fullName) && !this.studentsToView.includes(this.fullName)) {
                    this.notFoundStudents.push(this.fullName);
                } else {
                    return
                }
            }
        }
    }
})