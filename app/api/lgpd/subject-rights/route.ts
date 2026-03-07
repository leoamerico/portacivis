import {NextRequest, NextResponse} from 'next/server';
import {
  createSubjectRequest,
  getRequestsByUser,
  type RightType
} from '../../../../src/lib/lgpd/subject-rights-manager';

export const runtime = 'nodejs';

const VALID_RIGHT_TYPES: RightType[] = [
  'access',
  'rectify',
  'anonymize',
  'portability',
  'delete',
  'consent',
  'oppose'
];

function isValidRightType(value: unknown): value is RightType {
  return typeof value === 'string' && VALID_RIGHT_TYPES.includes(value as RightType);
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-session-id') ?? '';

    if (!userId || userId.trim().length < 8) {
      return NextResponse.json(
        {success: false, error: 'Missing or invalid x-session-id header'},
        {status: 400}
      );
    }

    const requests = await getRequestsByUser(userId.trim());

    return NextResponse.json({
      success: true,
      requests: requests.map((r) => ({
        id: r.id,
        date: r.date,
        rightType: r.rightType,
        status: r.status,
        deadline: r.deadline,
        responseDate: r.responseDate,
        dpoNotified: r.dpoNotified
      }))
    });
  } catch {
    return NextResponse.json(
      {success: false, error: 'Unable to retrieve requests'},
      {status: 500}
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      action?: unknown;
      sessionId?: unknown;
      payload?: unknown;
    };

    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

    if (!sessionId || sessionId.length < 8) {
      return NextResponse.json(
        {success: false, error: 'Missing or invalid sessionId'},
        {status: 400}
      );
    }

    if (!isValidRightType(body.action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: ${VALID_RIGHT_TYPES.join(', ')}`
        },
        {status: 400}
      );
    }

    const safePayload =
      body.payload !== null && typeof body.payload === 'object' && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : undefined;

    const subjectRequest = await createSubjectRequest({
      rawUserId: sessionId,
      rightType: body.action,
      payload: safePayload
    });

    return NextResponse.json({
      success: true,
      request: {
        id: subjectRequest.id,
        date: subjectRequest.date,
        rightType: subjectRequest.rightType,
        status: subjectRequest.status,
        deadline: subjectRequest.deadline,
        dpoNotified: subjectRequest.dpoNotified
      }
    });
  } catch {
    return NextResponse.json(
      {success: false, error: 'Unable to process request'},
      {status: 500}
    );
  }
}
