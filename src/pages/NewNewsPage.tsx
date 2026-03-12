import { NewsForm } from "../components/NewsForm/NewsForm";

export function NewNewsPage() {
    return (
    <section className="page">
        <header className="page-header">
            <p className="page-header__eyebrow">Ný frétt</p>
            <h1>Búa til nýja frétt</h1>
            <p className="page-header__description">Hér getur þú búið til nýja frétt. Fylltu út formið og smelltu á "Búa til frétt" takkann.   
            </p>
        </header>

        <NewsForm />
    </section>
    )

}