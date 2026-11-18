'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import useAuth from '../../lib/hooks/Auth';
import queryClient from '../../lib/queryclient';
import { errorMessage, unwrap } from '../../lib/actions/result';
import { formatMoney } from '../../lib/courses/format';
import {
  endCourseAccess,
  grantCourseAccess,
  listCatalog,
  listEnrollments,
  listOrders,
  recheckOrder,
} from '../../app/admin/courseActions';
import type { EnrollmentDTO, OrderDTO, OrderStatus } from '../../types/courses';

const input = 'bg-timbergreen border border-riverbed rounded-lg px-3 py-2 outline-none focus:border-eggblue';
const button = 'px-3 py-1 rounded-full text-xs bg-eggblue hover:bg-greenpea disabled:opacity-50 transition-colors';
const date = (ms?: number) => (ms ? new Date(ms).toLocaleString() : '—');

function useToken() {
  const { getIdToken } = useAuth();
  return async () => (await getIdToken()) ?? '';
}

function Heading({ title }: { title: string }) {
  return (
    <div className="max-w-lg rounded-r-full bg-eggblue py-2 px-4">
      <p className="text-xl font-light">{title}</p>
    </div>
  );
}

function GrantAccess({ courses }: { courses: Array<{ id: string; title: string }> }) {
  const token = useToken();
  const [user, setUser] = useState('');
  const [courseId, setCourseId] = useState('');
  const [reason, setReason] = useState('');

  const grant = useMutation({
    mutationFn: async () => unwrap(await grantCourseAccess(await token(), { courseId, user, reason })),
    onSuccess: () => {
      setUser('');
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['admin_enrollments'] });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (user && courseId) grant.mutate();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 max-w-xl">
      <p className="text-gray-300">
        Give a student access without paying online (bank transfer, scholarship, support). They must have signed in once.
      </p>
      <div className="flex flex-wrap gap-2">
        <input className={`${input} grow`} placeholder="Student email" value={user} onChange={(e) => setUser(e.target.value)} />
        <select className={input} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Course…</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>
      <input className={input} placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="flex items-center gap-3">
        <button type="submit" className={`${button} text-sm px-4 py-2`} disabled={!user || !courseId || grant.isPending}>
          {grant.isPending ? 'Granting…' : 'Grant access'}
        </button>
        {grant.isSuccess && <span className="text-eggblue">Access granted to {grant.data.student.email}.</span>}
        {grant.error && <span className="text-red-300">{errorMessage(grant.error)}</span>}
      </div>
    </form>
  );
}

function Orders() {
  const token = useToken();
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const orders = useQuery({
    queryKey: ['admin_orders', status],
    queryFn: async () => unwrap(await listOrders(await token(), { status: status || undefined })),
  });
  const recheck = useMutation({
    mutationFn: async (order: OrderDTO) => unwrap(await recheckOrder(await token(), { orderId: order.id })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin_enrollments'] });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <select className={`${input} max-w-xs`} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')}>
        <option value="">All orders</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>
      {orders.isLoading && <p>Loading…</p>}
      {orders.error && <p className="text-red-300">{errorMessage(orders.error)}</p>}
      {recheck.error && <p className="text-red-300">{errorMessage(recheck.error)}</p>}
      {orders.data && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-riverbed text-left">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Course</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Via</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.data.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-4 text-gray-300">No orders.</td></tr>
              )}
              {orders.data.map((order) => (
                <tr key={order.id} className="bg-timbergreen border-b border-riverbed">
                  <td className="px-3 py-2 whitespace-nowrap">{date(order.createdAt)}</td>
                  <td className="px-3 py-2">{order.student.email ?? order.student.name}</td>
                  <td className="px-3 py-2">{order.courseTitle}</td>
                  <td className="px-3 py-2">{formatMoney(order.amount)}</td>
                  <td className="px-3 py-2 capitalize">{order.payment.provider}</td>
                  <td className="px-3 py-2" title={order.failureReason}>{order.status}</td>
                  <td className="px-3 py-2">
                    {order.status === 'pending' && (
                      <button type="button" className={button} disabled={recheck.isPending} onClick={() => recheck.mutate(order)}>
                        Re-check
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function sourceLabel(enrollment: EnrollmentDTO) {
  switch (enrollment.source.type) {
    case 'purchase': return 'Purchased';
    case 'free': return 'Free';
    case 'grant': return `Granted${enrollment.source.reason ? `: ${enrollment.source.reason}` : ''}`;
  }
}

function Enrollments({ courses }: { courses: Array<{ id: string; title: string }> }) {
  const token = useToken();
  const [courseId, setCourseId] = useState('');
  const enrollments = useQuery({
    queryKey: ['admin_enrollments', courseId],
    queryFn: async () => unwrap(await listEnrollments(await token(), { courseId: courseId || undefined })),
  });
  const end = useMutation({
    mutationFn: async ({ enrollment, refunded }: { enrollment: EnrollmentDTO; refunded: boolean }) =>
      unwrap(await endCourseAccess(await token(), { enrollmentId: enrollment.id, refunded, reason: refunded ? 'Refunded' : 'Revoked by admin' })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
    },
  });
  // Ending access is irreversible from the student's side: ask inline.
  const [confirming, setConfirming] = useState<{ id: string; refunded: boolean } | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <select className={`${input} max-w-xs`} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        <option value="">Recent, all courses</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.title}</option>
        ))}
      </select>
      {enrollments.isLoading && <p>Loading…</p>}
      {enrollments.error && <p className="text-red-300">{errorMessage(enrollments.error)}</p>}
      {end.error && <p className="text-red-300">{errorMessage(end.error)}</p>}
      {enrollments.data && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-riverbed text-left">
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Course</th>
                <th className="px-3 py-2">Enrolled</th>
                <th className="px-3 py-2">How</th>
                <th className="px-3 py-2">Progress</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {enrollments.data.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-4 text-gray-300">No enrollments.</td></tr>
              )}
              {enrollments.data.map((enrollment) => {
                const done = Object.keys(enrollment.progress).length;
                const asking = confirming?.id === enrollment.id;
                return (
                  <tr key={enrollment.id} className="bg-timbergreen border-b border-riverbed">
                    <td className="px-3 py-2">{enrollment.student.email ?? enrollment.student.name}</td>
                    <td className="px-3 py-2">{enrollment.courseTitle}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{date(enrollment.enrolledAt)}</td>
                    <td className="px-3 py-2">{sourceLabel(enrollment)}</td>
                    <td className="px-3 py-2">{enrollment.certificateId ? 'Completed' : `${done} lessons`}</td>
                    <td className="px-3 py-2" title={enrollment.endReason}>{enrollment.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {enrollment.status === 'active' && !asking && (
                        <div className="flex gap-2">
                          <button type="button" className={button} onClick={() => setConfirming({ id: enrollment.id, refunded: false })}>
                            Revoke
                          </button>
                          {enrollment.source.type === 'purchase' && (
                            <button type="button" className={button} onClick={() => setConfirming({ id: enrollment.id, refunded: true })}>
                              Refunded
                            </button>
                          )}
                        </div>
                      )}
                      {asking && (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs">{confirming.refunded ? 'Mark refunded and end access?' : 'End access?'}</span>
                          <button
                            type="button"
                            className={`${button} bg-red-700 hover:bg-red-800`}
                            disabled={end.isPending}
                            onClick={() => end.mutate({ enrollment, refunded: confirming.refunded }, { onSettled: () => setConfirming(null) })}
                          >
                            Yes
                          </button>
                          <button type="button" className={button} onClick={() => setConfirming(null)}>No</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-300">
        &quot;Refunded&quot; only records the refund and ends access. Return the money from the eSewa or Khalti merchant dashboard.
      </p>
    </div>
  );
}

export default function CourseManagementContainer() {
  const token = useToken();
  const catalog = useQuery({
    queryKey: ['admin_catalog'],
    queryFn: async () => unwrap(await listCatalog(await token())),
  });
  const courses = catalog.data ?? [];

  return (
    <div className="text-white text-sm flex flex-col gap-6 px-4">
      <div>
        <p className="uppercase font-light text-3xl">Courses</p>
        <p className="font-light">Course content and prices are edited in the Sanity Studio.</p>
      </div>
      {catalog.error && <p className="text-red-300">{errorMessage(catalog.error)}</p>}

      <Heading title="Orders" />
      <Orders />

      <Heading title="Enrollments" />
      <Enrollments courses={courses} />

      <Heading title="Grant access" />
      <GrantAccess courses={courses} />
    </div>
  );
}
