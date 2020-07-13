const StudentBallance = Vue.component('student-ballance', {
    props: ['name', 'lessons', 'payments', 'paymentballance'],
    template: `<div class="student-info-form">
    <table>
        <tr>
            <td class="table-left">Name:</td>
            <td class="student-form-names"><span> {{ name }}</span></td>
        </tr>
        <tr>
            <td class="table-left">Lessons left:</td>
            <td class="table-right"><span class="student-form-numbers">{{ paymentballance }}</span></td>
        </tr>
        <tr>
            <td class="table-left">Lessons attended:</td>
            <td class="table-right"><span class="student-form-numbers">{{ lessons }}</span></td>
        </tr>
        <tr>
            <td class="table-left">Total Payments:</td>
            <td class="table-right"><span class="student-form-numbers">{{ payments }} Eur</span></td>
        </tr>
    </table>
</div>`
});

const StudentNotFound = Vue.component('not-found-student', {
    props: ['name'],
    template: '<div class="student-not-found">Student {{ name }} is not in the list</div>'
});

const GetFullName = Vue.component('get-full-name', {
    template: '<div class="student-not-found">Please provide full name</div>'
});

const newPayment = Vue.component('new-payment', {
    props: ['name', 'payment', 'date'],
    template: '<div class="student-info-form">The payment provided by the {{name}} on {{date}}, is - {{payment}}</div>'
});

const AllStudents = Vue.component('all-students', {
    props: ['names'],
    template: `<div class="student-info-form"><ul id="example-1">
    <li v-for="student in names" :key="student">
        {{ student }}
    </li>
</ul></div>`
})