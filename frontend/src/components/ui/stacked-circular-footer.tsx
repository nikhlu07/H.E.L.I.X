import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Facebook, Github, Instagram, Linkedin, Twitter} from "lucide-react"

function StackedCircularFooter() {
  return (
    <footer className="py-12 flex flex-col justify-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 rounded-full bg-primary/10 p-8">
          <img src="logo-black.svg" className="h-8 w-auto"/>
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Services</a>
            <a href="#" className="hover:text-primary">Products</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Github className="h-4 w-4" />
              <span className="sr-only">Github</span>
            </Button>
            {/*<Button variant="outline" size="icon" className="rounded-full">*/}
            {/*  <Twitter className="h-4 w-4" />*/}
            {/*  <span className="sr-only">Twitter</span>*/}
            {/*</Button>*/}
            {/*<Button variant="outline" size="icon" className="rounded-full">*/}
            {/*  <Instagram className="h-4 w-4" />*/}
            {/*  <span className="sr-only">Instagram</span>*/}
            {/*</Button>*/}
            {/*<Button variant="outline" size="icon" className="rounded-full">*/}
            {/*  <Linkedin className="h-4 w-4" />*/}
            {/*  <span className="sr-only">LinkedIn</span>*/}
            {/*</Button>*/}
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" className="rounded-full" />
              </div>
              <Button type="submit" className="rounded-full">Subscribe</Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 H.E.L.I.X. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }
