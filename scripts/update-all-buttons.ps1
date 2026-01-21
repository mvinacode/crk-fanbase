$pagesDir = "c:\Users\bibic\Desktop\Mes dossiers\crk-site-main\pages"
$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "cookie_*.html"

Write-Host "Mise a jour de" $htmlFiles.Count "fichiers HTML..."

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Mettre a jour les boutons costume avec spans
    $content = $content -replace '<a class="btn-costume" href="#">Costumes</a>', '<a class="btn-costume" href="#"><span>Costumes</span></a>'
    
    # Mettre a jour les boutons save avec spans
    $content = $content -replace '<button class="btn-save" id="btn-save">Sauvegarder</button>', '<button class="btn-save" id="btn-save"><span>Sauvegarder</span></button>'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Mis a jour:" $file.Name -ForegroundColor Green
}

Write-Host "Termine!" $htmlFiles.Count "fichiers traites." -ForegroundColor Cyan
