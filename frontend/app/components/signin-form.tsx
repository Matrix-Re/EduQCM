import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import {useState} from "react";
import {useAuthStore} from "~/store/auth";
import {login} from "~/api/auth";
import {useNavigate} from "react-router";

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      username: String(fd.get("username") ?? ""),
      password: String(fd.get("password") ?? ""),
    }

    // Check if all fields are filled
    if (!payload.username || !payload.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const data = await login(payload.username, payload.password);

      setAuth(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>EduQCM</CardTitle>
        <CardDescription>
          Enter your information below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Username</FieldLabel>
              <Input name="username" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input name="password" type="password" required />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="button-primary">login</Button>
                <FieldDescription className="px-6 text-center">
                  You don't have an account? <a href="register">Sign up</a>
                </FieldDescription>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
